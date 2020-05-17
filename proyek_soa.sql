-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2020 at 05:09 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

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
-- Table structure for table `review`
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
-- Dumping data for table `review`
--

INSERT INTO `review` (`id_review`, `email`, `id_jenis`, `nama_jenis`, `jenis`, `comment`, `rating`) VALUES
(1, 'julianto@gmail.com', 'MM__99b2f1d5-e56d-4901-95ae-0d38a3a3694e', 'Singapore hop-on hop-off bus tour', 'Tour', 'tour nya sangat baik, bus nya juga bagus, pokoknya sip deh', 5),
(2, 'julianto@gmail.com', 'MM__99b2f1d5-e56d-4901-95ae-0d38a3a3694e', 'Singapore hop-on hop-off bus tour', 'Tour', 'tour ini yang terbaik', 5);

-- --------------------------------------------------------

--
-- Table structure for table `user`
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
  `api_hit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `email`, `nama_lengkap`, `nomor_hp`, `password`, `tipe_user`, `saldo`, `api_hit`) VALUES
(1, 'edwin@gmail.com', 'edwin sidharta', '08123123123', '123', 0, 988000, 24),
(2, 'ferdinan@gmail.com', 'ferdinan gutana', '08123123123', '123', 0, 0, 7),
(3, 'cosmas@gmail.com', 'cosmas YBG', '08123123123', '123', 0, 0, 10),
(4, 'julianto@gmail.com', 'eliphaz julianto', '08123123123', '123', 1, 20000, 0),
(5, 'bambang@gmail.com', 'bambang', '08123123123', '123', 0, 0, 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id_review`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
