<?php
	/**
	* 前端独立测试用接口
	* 用于模拟数据
	*/
	define("DEBUG", true); // 输出json时是否插入当前实际调用的文件路径
	define("DP",DIRECTORY_SEPARATOR);
	define("ROOT",dirname(__FILE__).DP);
	define("CONFIG_PATH", ROOT."api".DP."server_config.php");

	$path = $_GET['_p'];
	$d_path = ROOT."test".DP.(str_replace('/', DP, $path));

	// 获取对应文件名
	$qur_str = $_SERVER["QUERY_STRING"];
	$qur_str = preg_replace("/_p=[^&]*&?/i", "", $qur_str);
	$qur_str = preg_replace("/&?_debug=[^&]*/i", "", $qur_str); // _debug参数必须在url参数末尾
	$file_name = realFilename($path,$qur_str);
	$file_name = $d_path.DP.$file_name.".json";

	// 快速根据请求参数来创建样板文件
	if(isset($_GET["_debug"])) {
		// 创建目录
		if(!is_dir($d_path)){
			if(!mkDirs($d_path)){
				die("创建目录失败！");
			}
		}

		// 创建文件
		if(!is_file($file_name)){

			$fp=fopen($file_name, "w+"); //打开文件指针，创建文件
			if ( !is_writable($file_name) ){
				die("文件:" .$file_name. "不可写，请检查！");
			}

			// 写入初始数据
			$data_template = '{"status":0,"data":{},"errMsg":""}';
			fwrite($fp, $data_template);
			fclose($fp);

			// 返回刚创建的数据
			die($data_template);
		}

	}

	// 未配置模拟数据，返回提示信息
	if(!is_dir($d_path)){
		die("未创建数据路径: $d_path ，请检查！或在url末尾添加_debug参数进行自动创建（注：自动创建的需手动从发布路径复制回开发test目录下）。<a href='".$_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING']."&_debug=1'>点我自动访问</a>");
	}
	if(!is_file($file_name)){
		die("未创建数据文件: $file_name ，请检查！或在url末尾添加_debug参数进行自动创建（注：自动创建的需手动从发布路径复制回开发test目录下）。<a href='".$_SERVER['PHP_SELF'].'?'.$_SERVER['QUERY_STRING']."&_debug=1'>点我自动访问</a>");
	}

	// 获取并返回模拟数据
	$json = file_get_contents($file_name);
	if(DEBUG){
		$jsonObj = json_decode($json);
		if(is_array($jsonObj)){ 
			$jsonObj["_filename"] = addslashes($file_name);
		}else{ 
			$jsonObj->_filename = addslashes($file_name);
		}
		
		$json = json_encode($jsonObj);
	}

	header("Content-type: application/json"); 
	die($json);


/////////////////////////////////////////////////////////////

// 通用函数

////////////////////////////////////////////////////////////

	// 递归创建目录
	function mkDirs($dir){
	    if(!is_dir($dir)){
			if(!mkDirs(dirname($dir))){
				return false;
			}
			if(!mkdir($dir,0777)){
				return false;
			}
		}
		return true;
	}

	// 输出json结果
	function outJson($out_arr){
		die(json_encode($out_arr));
	}

	/**
	 * 检测匹配路径是否有对应的正则替换, 如果有则将路径替换为替换路径
	 * @param $path String uri路径
	 * @param $file_name String 请求参数替换后的文件名
	 * @return String 匹配替换后的文件名
	 */
	function realFilename($path, $file_name){
		// 没有url参数时，默认文件名为 index
		if($file_name == "") $file_name = "index";

		$config_arr = include("api".DP."server_config.php");
		if(isset($config_arr[$path])){
			foreach($config_arr[$path] as $reg=>$file){ 
				if(preg_match($reg, $file_name)){
					$file_name = $file;
					break;
				}
			}
		}

		return $file_name;
	}

?>