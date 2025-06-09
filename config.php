<?php
$dbhost = 'roundhouse.proxy.rlwy.net';
$dbport = '5432';
$dbname = 'railway';
$dbuser = 'postgres';
$dbpass = 'MOjyKgoifNnvMjTynWhpYaTKuTbqPEzF@switchyard';

// Koneksi ke PostgreSQL
$conn = pg_connect("host=$dbhost port=$dbport dbname=$dbname user=$dbuser password=$dbpass");

if (!$conn) {
    die("Koneksi gagal: " . pg_last_error());
}
?>
