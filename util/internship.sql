-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 16, 2020 at 03:22 PM
-- Server version: 5.7.21
-- PHP Version: 7.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `internship`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
CREATE TABLE IF NOT EXISTS `answers` (
  `answer_id` int(5) NOT NULL AUTO_INCREMENT,
  `answer_detail` varchar(300) NOT NULL,
  `user_id` int(5) NOT NULL,
  `question_id` int(5) NOT NULL,
  `ans_date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`answer_id`),
  KEY `question_id` (`question_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `answers`
--

INSERT INTO `answers` (`answer_id`, `answer_detail`, `user_id`, `question_id`, `ans_date_time`) VALUES
(1, 'yes, your right user2 Everything is actually a thing which includes every', 4, 3, '2020-05-20 20:59:26'),
(2, 'hii i\'m not verified yet.', 5, 2, '2020-05-20 21:46:39'),
(3, 'mu answer in this question', 5, 3, '2020-05-20 22:50:22'),
(4, 'oy hoyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyoy hoyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', 5, 2, '2020-05-20 23:53:09'),
(5, 'my new anser', 4, 2, '2020-07-11 21:33:56'),
(6, 'my answer of that question is my question that you can\'t be able to ask!!', 4, 5, '2020-07-11 21:36:27'),
(7, 'lets check multiple lines.\r\nnow i\'am in second line.', 4, 5, '2020-07-11 21:37:13');

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
CREATE TABLE IF NOT EXISTS `chat` (
  `detail` varchar(300) NOT NULL,
  `sender_id` int(5) NOT NULL,
  `receive_id` int(5) NOT NULL,
  `send_by` int(2) NOT NULL DEFAULT '0' COMMENT 'no use',
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `receive_id` (`receive_id`),
  KEY `sender_id` (`sender_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`detail`, `sender_id`, `receive_id`, `send_by`, `date_time`) VALUES
('hello jiga majama', 1, 4, 0, '2020-05-18 22:39:14'),
('yes jiga majama', 4, 1, 0, '2020-05-18 22:39:35'),
('Hii, How can i help you?', 4, 1, 0, '2020-05-19 05:16:09'),
('hii', 1, 5, 0, '2020-05-19 05:58:10'),
('Hii, How can i help you?', 3, 1, 0, '2020-05-19 13:13:38'),
('hello doctor my name is zain.', 1, 4, 0, '2020-05-19 15:28:56'),
('hii taav na doctor kam che majama bas jo mane to santi che.', 1, 3, 0, '2020-05-19 15:30:20'),
('nai joyti tari madad', 1, 3, 0, '2020-05-19 15:30:41'),
('hii Test 2', 1, 3, 0, '2020-05-19 15:32:57'),
('hii zain i\'m your doctor tell me how can i help you uou moron.', 4, 1, 0, '2020-05-20 16:41:24'),
('tell mi jiga what you want.', 4, 1, 0, '2020-05-20 16:52:37'),
('Hello, I\'m a Doctor', 4, 2, 0, '2020-05-20 16:57:20'),
('hii user2 dummy bol.', 4, 2, 0, '2020-05-20 16:57:41'),
('i told you dumass don\'t text me.', 4, 2, 0, '2020-05-20 16:58:03'),
('hii doctor', 2, 4, 0, '2020-05-20 17:01:03'),
('helloo', 2, 4, 0, '2020-05-20 17:01:47'),
('oy hoyyyyyyyyyyyyyyyy', 2, 4, 0, '2020-05-20 17:27:06'),
('Hii, How can i help you?', 3, 2, 0, '2020-05-20 17:31:22'),
('oyy sappa', 2, 3, 0, '2020-05-20 17:31:34'),
('Hii, How can i help you?', 4, 9, 0, '2020-05-25 18:03:31'),
('hii doctor my name is Zain mansuri!!', 9, 4, 0, '2020-05-25 18:03:50'),
('hhanji long time no seen', 4, 2, 0, '2020-07-11 12:10:10'),
('7 week hogaya ', 4, 1, 0, '2020-07-11 21:22:52'),
('Hello, I\'m a Doctor', 4, 8, 0, '2020-07-11 21:23:23'),
('how can i help you!', 4, 8, 0, '2020-07-11 21:23:38');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_detail`
--

DROP TABLE IF EXISTS `doctor_detail`;
CREATE TABLE IF NOT EXISTS `doctor_detail` (
  `user_id` int(5) NOT NULL,
  `doctor_id` varchar(15) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` varchar(300) NOT NULL,
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `doctor_detail`
--

INSERT INTO `doctor_detail` (`user_id`, `doctor_id`, `category`, `description`) VALUES
(3, '123456789', 'taav', 'taav ave ani mateno doctor'),
(4, '123456788', 'sarir', 'now sasir time!'),
(5, '123456789', 'sarir', 'sarir dukhe ani mateno doctor'),
(10, '654123ZAQ', 'category1', 'i\' tav\'s doctor2 ');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
CREATE TABLE IF NOT EXISTS `media` (
  `media_id` int(5) NOT NULL AUTO_INCREMENT,
  `media_desc` varchar(1200) NOT NULL,
  `media_type` varchar(10) NOT NULL DEFAULT 'blog' COMMENT 'image, blog, video',
  `media_title` varchar(100) NOT NULL,
  `media` varchar(200) DEFAULT NULL COMMENT 'image or video',
  `user_id` int(5) NOT NULL,
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`media_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`media_id`, `media_desc`, `media_type`, `media_title`, `media`, `user_id`, `date_time`) VALUES
(1, 'i want to write somthing here but i don\'t know what.', 'text', 'my blog text ', NULL, 4, '2020-06-01 11:34:58'),
(3, 'video i want to write somthing here but i don\'t know what Video 2.', 'video', 'my blog video2', 'https://www.youtube.com/embed/hj2gyYlkWgk', 4, '2020-06-01 11:40:38'),
(4, 'image type check and it\'s  working.', 'image', 'image uploading ', '4_47049793_p0.jpg', 4, '2020-06-01 16:39:59');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
CREATE TABLE IF NOT EXISTS `questions` (
  `question_id` int(5) NOT NULL AUTO_INCREMENT,
  `user_id` int(5) NOT NULL,
  `status` int(2) NOT NULL DEFAULT '0' COMMENT '1-hide user',
  `title` varchar(30) NOT NULL,
  `question_detail` varchar(300) NOT NULL,
  `question_category` varchar(50) NOT NULL,
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `user_id`, `status`, `title`, `question_detail`, `question_category`, `date_time`) VALUES
(2, 2, 0, 'title1', 'i don\'t want to say anything you dummy.', 'taav', '2020-05-20 18:25:01'),
(3, 2, 1, 'About noyhing?', 'Tell me if everything is nothing than how come is nothing is everything ?\r\nTell Me....', 'sarir', '2020-05-20 20:35:09'),
(4, 5, 0, 'question', 'question ? questionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestion', 'sarir', '2020-05-20 23:41:48'),
(5, 9, 0, 'my first quesition', 'i don\'t now what i want to ask!!!!!', 'sarir', '2020-05-25 18:04:27'),
(6, 4, 0, 'Am\'i a doctor ?', 'if yes say yes otherwise say no to yes', 'taav', '2020-07-11 21:37:54'),
(7, 4, 0, 'the result test', 'question', 'taav', '2020-07-16 19:57:04'),
(8, 4, 0, 'the result test', 'question is here with more question and answers, say, yes\r\n ,yes \r\nnow ask', 'taav', '2020-07-16 19:58:59');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(5) NOT NULL AUTO_INCREMENT,
  `f_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `gender` varchar(7) NOT NULL,
  `dob` date NOT NULL,
  `password` varchar(100) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `status` int(2) NOT NULL DEFAULT '0' COMMENT '1-verified,2-block Warning,3-block',
  `type` varchar(15) NOT NULL DEFAULT 'user',
  `registration_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `f_name`, `l_name`, `email`, `phone`, `gender`, `dob`, `password`, `image`, `status`, `type`, `registration_date`) VALUES
(1, 'user1', 'user1', 'user@email.com', '9876543210', 'male', '1990-07-17', 'password', NULL, 0, 'user', '2020-05-18 21:09:56'),
(2, 'user2', 'user2', 'user2@email.com', '9876543211', 'male', '1990-07-17', 'password', NULL, 0, 'user', '2020-05-18 22:10:52'),
(3, 'doctor1', 'doctor1', 'doctor@email.com', '9876544210', 'male', '1990-07-17', 'password', NULL, 1, 'doctor', '2020-05-18 22:17:26'),
(4, 'doctor2', 'doctor2', 'doctor2@email.com', '9876544211', 'female', '1992-12-02', 'password', NULL, 1, 'doctor', '2020-05-18 22:17:26'),
(5, 'doctor3', 'doctor3', 'doctor3@email.com', '9876644210', 'female', '1980-12-02', 'password', NULL, 0, 'doctor', '2020-05-18 22:18:28'),
(6, 'admin', 'admin', 'admin@email.com', '9976644210', 'male', '1985-01-12', 'password', NULL, 0, 'admin', '2020-05-18 22:19:27'),
(7, 'user3', 'user3', 'user3@email.com', '9856321470', 'female', '1990-12-05', 'password', NULL, 0, 'user', '2020-05-20 16:36:25'),
(8, 'user', 'user', 'user11@email.com', '9595958787', 'Male', '2010-05-20', 'user', NULL, 0, 'user', '2020-05-25 00:30:17'),
(9, 'zain', 'mansuri', 'zainmansuri7@gmail.com', '9033320142', 'Male', '1998-12-15', 'password', NULL, 0, 'user', '2020-05-25 17:25:55'),
(10, 'kane', 'kane', 'kali@email.com', '9856474747', 'Female', '1990-12-12', 'password', NULL, 0, 'doctor', '2020-05-25 17:35:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `questions`
--
ALTER TABLE `questions` ADD FULLTEXT KEY `title` (`title`);
ALTER TABLE `questions` ADD FULLTEXT KEY `title_2` (`title`,`question_category`,`question_detail`);

--
-- Indexes for table `user`
--
ALTER TABLE `user` ADD FULLTEXT KEY `f_name` (`f_name`,`l_name`,`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`receive_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `doctor_detail`
--
ALTER TABLE `doctor_detail`
  ADD CONSTRAINT `doctor_detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
