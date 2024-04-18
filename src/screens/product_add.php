<?php

include '../config.php';
$product_category_id = $_POST['product_category_id'];
$item_name = $_POST['item_name'];
$item_desc = $_POST['item_desc'];

$response['save_response'] = array();
$response['array_tags'] = array();

	$query_check = mysql_num_rows(mysql_query("SELECT product_id from tbl_products where product_name='$item_name'"));

	if ($query_check > 0) {
		$list['status'] = 'duplicate';
		array_push($response['save_response'], $list);
	} else {
		$file_name = rand() . "_" . time() . $_FILES['image']['type'];
	    $target_dir = "../assets/menu";

		if (!file_exists($target_dir)) {
			mkdir($target_dir, 0777, true);
		}

		$target_dir = $target_dir . "/" .$file_name;
		$save_dir = "assets/menu/".$file_name;
		if (move_uploaded_file($_FILES['image']['tmp_name'], $target_dir)) {

			$query_add = mysql_query("INSERT INTO `tbl_products` (`product_id`, `product_category_id`, `product_name`, `image_url`, `product_details`) VALUES (NULL, '$product_category_id', '$item_name', '$save_dir', '$item_desc')");

			if ($query_add) {
				$list['status'] = 'success';
				array_push($response['save_response'], $list);

			} else {
				$list['status'] = 'failed';
				array_push($response['save_response'], $list);
			}

		}else{
				$list['status'] = 'failed';
				array_push($response['save_response'], $list);
		}

	}

echo json_encode($response);

?>