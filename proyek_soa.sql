-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 20 Bulan Mei 2020 pada 11.30
-- Versi server: 10.4.8-MariaDB
-- Versi PHP: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proyek_soa`
--
CREATE DATABASE IF NOT EXISTS `proyek_soa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `proyek_soa`;

-- --------------------------------------------------------

--
-- Struktur dari tabel `review`
--

DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `id_review` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `id_jenis` varchar(255) NOT NULL,
  `nama_jenis` varchar(255) NOT NULL,
  `jenis` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `review`
--

INSERT INTO `review` (`id_review`, `email`, `id_jenis`, `nama_jenis`, `jenis`, `comment`, `rating`) VALUES
(1, 'julianto@gmail.com', 'MM__99b2f1d5-e56d-4901-95ae-0d38a3a3694e', 'Singapore hop-on hop-off bus tour', 'Tour', 'tour nya sangat baik, bus nya juga bagus, pokoknya sip deh', 5),
(2, 'julianto@gmail.com', 'MM__99b2f1d5-e56d-4901-95ae-0d38a3a3694e', 'Singapore hop-on hop-off bus tour', 'Tour', 'tour ini yang terbaik', 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `nomor_hp` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipe_user` int(11) NOT NULL,
  `saldo` int(11) NOT NULL,
  `api_hit` int(11) NOT NULL,
  `gambar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `email`, `nama_lengkap`, `nomor_hp`, `password`, `tipe_user`, `saldo`, `api_hit`, `gambar`) VALUES
(1, 'edwin@gmail.com', 'edwin sidharta', '08123123123', '123', 0, 988500, 24, 'default.jpg'),
(2, 'ferdinan@gmail.com', 'ferdinan gutana', '08123123123', '123', 0, 0, 7, 'default.jpg'),
(3, 'cosmas@gmail.com', 'cosmas YBG', '08123123123', '123', 0, 0, 10, 'default.jpg'),
(4, 'julianto@gmail.com', 'eliphaz julianto', '08123123123', '123', 1, 4923500, 0, 'default.jpg'),
(5, 'bambang@gmail.com', 'bambang', '08123123123', '123', 0, 0, 10, 'default.jpg'),
(6, 'bambang2@gmail.com', 'bambang', '08123123123', '123', 0, 0, 10, 'default.jpg'),
(7, 'bambang23@gmail.com', 'bambang', '08123123123', '123', 0, 0, 10, 'default.jpg');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id_review`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `review`
--
ALTER TABLE `review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
