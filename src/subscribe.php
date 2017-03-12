<?php

foreach (glob("./Dotenv/*.php") as $filename)
{
    require_once($filename);
}
use Dotenv;
$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load();

$email = $_POST["email"];
$fname = isset($_POST["fname"])?$_POST["fname"]:'';
$city = $_POST["city"];
$apikey = getenv('MAILCHIMP_APIKEY');
$listid = '06ec1d1ca4';
$server = 'us14.';

mc_subscribe($email, $fname, $city, $apikey, $listid, $server);

function mc_subscribe($email, $fname, $debug, $apikey, $listid, $server) {
	$auth = base64_encode( 'user:'.$apikey );
	$data = array(
		'apikey'        => $apikey,
		'email_address' => $email,
		'status'        => 'subscribed',
    'FIRSTNAME' => $fname,
    'CITY' => $city
		);
	$json_data = json_encode($data);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://'.$server.'api.mailchimp.com/3.0/lists/'.$listid.'/members/');
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: Basic '.$auth));
	curl_setopt($ch, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);

	$result = curl_exec($ch);

  var_dump($result);
  die('<br><br>*Creepy etheral voice* : Mailchimp executed subscribe');

	die();
};

?>