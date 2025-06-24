-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Máj 27. 19:57
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `langeeks`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `groupmembers`
--

CREATE TABLE `groupmembers` (
  `joined_date` date DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `groupmembers`
--

INSERT INTO `groupmembers` (`joined_date`, `user_id`, `group_id`) VALUES
('2025-04-25', 38, 65),
('2025-04-25', 10, 67),
('2025-04-25', 39, 63),
('2025-05-23', 40, 67),
('2025-05-23', 39, 67),
('2025-05-23', 10, 65),
('2025-05-23', 40, 65),
('2025-05-23', 41, 74);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `groupname` varchar(20) NOT NULL,
  `groupadmin_id` int(11) DEFAULT NULL,
  `created_date` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `groups`
--

INSERT INTO `groups` (`group_id`, `groupname`, `groupadmin_id`, `created_date`) VALUES
(63, 'Mund1967', 40, '2025-04-25'),
(64, 'Tyrell', 42, '2025-04-25'),
(65, 'Sunfyre', 43, '2025-04-25'),
(67, 'JapaneseDrill', 44, '2025-04-25'),
(68, 'Hajadon', 10, '2025-04-27'),
(70, 'GermanGroup', 10, '2025-05-20'),
(71, 'Anyagin', 40, '2025-05-23'),
(72, 'Amygdala', 44, '2025-05-23'),
(73, 'FrenchGroup', 38, '2025-05-23'),
(74, 'Ahab\'sGroup', 39, '2025-05-23'),
(75, 'ItalianGroup', 37, '2025-05-23');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `languages`
--

CREATE TABLE `languages` (
  `language_id` int(11) NOT NULL,
  `languagename` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `languages`
--

INSERT INTO `languages` (`language_id`, `languagename`) VALUES
(6, 'Chinese'),
(2, 'English'),
(1, 'German'),
(4, 'Italian'),
(5, 'Japanese'),
(7, 'Russian'),
(3, 'Spanish');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `sent_date` datetime DEFAULT current_timestamp(),
  `message` text NOT NULL,
  `sender` int(11) DEFAULT NULL,
  `reciever` int(11) DEFAULT NULL,
  `groupchat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `messages`
--

INSERT INTO `messages` (`message_id`, `sent_date`, `message`, `sender`, `reciever`, `groupchat`) VALUES
(117, '2025-04-25 14:40:54', 'Hi Albert!', 37, 10, NULL),
(118, '2025-04-25 14:41:25', 'Hello Merill!', 10, 37, NULL),
(121, '2025-04-25 15:06:32', 'Welcome to my groupchat! My name is Kazuhira', 44, NULL, 67),
(122, '2025-04-25 15:13:12', 'nice to meet you Kazuhira', 10, NULL, 67),
(123, '2025-04-25 15:13:36', 'Hey how are you doing?', 44, 10, NULL),
(124, '2025-04-25 15:15:55', 'i am ok', 10, 44, NULL),
(125, '2025-04-25 15:16:01', 'And you?', 10, 44, NULL),
(126, '2025-04-25 15:16:17', 'I am ok too... not much', 44, 10, NULL),
(127, '2025-04-25 15:28:06', 'Hi! Al', 39, 10, NULL),
(128, '2025-04-25 15:28:22', 'Hi Captain!', 10, 39, NULL),
(131, '2025-04-25 15:37:52', 'Good to see you Pamela', 43, NULL, 65),
(132, '2025-04-25 15:38:16', 'Its good to see you too!', 38, NULL, 65),
(133, '2025-04-25 15:39:19', 'wie geht?', 38, NULL, 65),
(134, '2025-04-25 15:39:25', 'ja! ja!', 38, NULL, 65),
(135, '2025-04-25 15:39:39', 'Ja! Ja!', 43, NULL, 65),
(136, '2025-04-25 15:45:04', 'You want to join my group?', 43, 38, NULL),
(137, '2025-04-25 15:45:23', 'Yes!! i would love to!', 38, 43, NULL),
(139, '2025-04-27 10:26:10', 'hali!', 10, NULL, 68),
(140, '2025-04-27 10:26:20', 'szió', 37, NULL, 68),
(141, '2025-04-27 10:27:03', 'mizu?', 39, 10, NULL),
(142, '2025-04-27 10:27:12', 'semmi veled?', 10, 39, NULL),
(143, '2025-04-27 10:27:23', 'szia', 37, 10, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `sent_date` date NOT NULL DEFAULT current_timestamp(),
  `message` varchar(255) NOT NULL,
  `sent_by` int(11) DEFAULT NULL,
  `sent_to_group` int(11) DEFAULT NULL,
  `reciver_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `notifications`
--

INSERT INTO `notifications` (`notification_id`, `sent_date`, `message`, `sent_by`, `sent_to_group`, `reciver_user`) VALUES
(208, '2025-04-25', 'Albert000 would like to join your Mund1967 group.', 10, 63, 40),
(211, '2025-04-25', 'Pamela would like to join your Mund1967 group.', 38, 63, 40),
(216, '2025-05-23', 'Ellison would like to join your Tyrell group.', 40, 64, 42),
(217, '2025-05-23', 'Ellison would like to join your GermanGroup group.', 40, 70, 10),
(218, '2025-05-23', 'Ellison would like to join your Hajadon group.', 40, 68, 10),
(221, '2025-05-23', 'Kazuhira would like to join your Mund1967 group.', 44, 63, 40),
(222, '2025-05-23', 'Kazuhira would like to join your Tyrell group.', 44, 64, 42),
(223, '2025-05-23', 'Kazuhira would like to join your Anyagin group.', 44, 71, 40),
(224, '2025-05-23', 'Ahab would like to join your GermanGroup group.', 39, 70, 10),
(225, '2025-05-23', 'Ahab would like to join your Hajadon group.', 39, 68, 10),
(227, '2025-05-23', 'Ahab would like to join your Anyagin group.', 39, 71, 40),
(228, '2025-05-23', 'Aegon would like to join your Amygdala group.', 43, 72, 44),
(229, '2025-05-23', 'Aegon would like to join your FrenchGroup group.', 43, 73, 38),
(231, '2025-05-23', 'Aegon would like to join your Anyagin group.', 43, 71, 40),
(232, '2025-05-23', 'Aegon would like to join your Tyrell group.', 43, 64, 42),
(233, '2025-05-23', 'Astarion would like to join your Mund1967 group.', 41, 63, 40),
(234, '2025-05-23', 'Astarion would like to join your Tyrell group.', 41, 64, 42),
(235, '2025-05-23', 'Astarion would like to join your Sunfyre group.', 41, 65, 43),
(236, '2025-05-23', 'Astarion would like to join your ItalianGroup group.', 41, 75, 37),
(238, '2025-05-23', 'Astarion would like to join your FrenchGroup group.', 41, 73, 38),
(239, '2025-05-23', 'Astarion would like to join your Amygdala group.', 41, 72, 44),
(240, '2025-05-23', 'Ahab would like to join your FrenchGroup group.', 39, 73, 38);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rulebreaks`
--

CREATE TABLE `rulebreaks` (
  `rulebreak_id` int(11) NOT NULL,
  `rulebreak_description` varchar(255) DEFAULT NULL,
  `rulebreak_date` date DEFAULT current_timestamp(),
  `reporter` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `rulebreaks`
--

INSERT INTO `rulebreaks` (`rulebreak_id`, `rulebreak_description`, `rulebreak_date`, `reporter`) VALUES
(24, 'Albert000 was spamming the chat!', '2025-04-25', 44),
(25, 'Aegon was saying saying bad things!', '2025-04-25', 38);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `created_date` date DEFAULT current_timestamp(),
  `isAdmin` tinyint(1) DEFAULT 0,
  `ban_date_end` date DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `created_date`, `isAdmin`, `ban_date_end`, `language_id`) VALUES
(10, 'Albert000', '$2b$10$8HGA76YP7P6.J4wcPYyRBORWLdxb.0KktgAwVXI4bRpUqAkd9FVki', 'Albert000@gmail.com', '2025-02-26', 1, NULL, 4),
(17, 'Cpyer000', '$2b$10$GQSantxqmLWaydOohkehCe4HTI6yyP1I.aTzM6rD1LeMzF51NKp0K', 'Cpyer000Cpyer000@gmail.com', '2025-03-21', 1, NULL, 1),
(37, 'Merill', '$2b$10$zVK7LAaAa/EH4DAxos7.T.ZKWgqMQlndhMPUOYHAsjPan7X9C4oDO', 'Merill@gmail.com', '2025-04-25', 0, NULL, 4),
(38, 'Pamela', '$2b$10$XLeuRqtGGCb4Wv4xzfl5v.d2PDhIz3g6repT0HmOrVFZW7ytGywAm', 'Pamela@gmail.com', '2025-04-25', 0, NULL, 2),
(39, 'Ahab', '$2b$10$D25798YO/tmDDdaWT/Q1yO46QIKommQhuGOfgviDbgW.75V6fhMkK', 'Ahab@gmail.com', '2025-04-25', 0, NULL, 5),
(40, 'Ellison', '$2b$10$32gTzzP46muMCiEqaJhfYO.BXKZqnELNMVSdqgF6kmhVwh255kXUa', 'Ellison@gmail.com', '2025-04-25', 0, NULL, 6),
(41, 'Astarion', '$2b$10$xZGeKgwYKp8tFEQpdV2CmeTDfaLhwntDjDhkvFouB78xytGT/DKNy', 'Astarion@gmail.com', '2025-04-25', 0, NULL, 5),
(42, 'Margaery', '$2b$10$Qvs25h91crny00oNxoCIE.928Qm0XduwIdSQIbpY6pahoSTDh4G/C', 'Margaery@gmail.com', '2025-04-25', 0, NULL, 1),
(43, 'Aegon', '$2b$10$bTl5/XMUFFx165SBXVm6Ke9lVHguw2UxWtSgbGXdoeXIbQQdhO5Iy', 'Aegon@gmail.com', '2025-04-25', 0, NULL, 5),
(44, 'Kazuhira', '$2b$10$rPS/eUo01REoCp5gfVy6S.UblbUqUNIRMYQYlRAS97ILubJeWIFe.', 'Kazuhira@gmail.com', '2025-04-25', 0, NULL, 5),
(45, 'Arnold', '$2b$10$GmgZTwPVbPG2QC7Ey/zASe8NOfTLPzTyuwvMKZInKCcyHssA1JIbG', 'Arnold@gmail.com', '2025-04-27', 0, '2025-10-20', 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD KEY `fk_group_id` (`group_id`) USING BTREE,
  ADD KEY `fk_user_id` (`user_id`);

--
-- A tábla indexei `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`),
  ADD KEY `fk_user_id` (`groupadmin_id`) USING BTREE;

--
-- A tábla indexei `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`language_id`),
  ADD UNIQUE KEY `LanguageName` (`languagename`);

--
-- A tábla indexei `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `fk_sender_user_id` (`sender`) USING BTREE,
  ADD KEY `fk_reciver_user_id` (`reciever`) USING BTREE,
  ADD KEY `fk_group_id` (`groupchat`) USING BTREE;

--
-- A tábla indexei `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_group_id` (`sent_to_group`) USING BTREE,
  ADD KEY `fk_user_id` (`reciver_user`) USING BTREE,
  ADD KEY `fk_sent_by` (`sent_by`) USING BTREE;

--
-- A tábla indexei `rulebreaks`
--
ALTER TABLE `rulebreaks`
  ADD PRIMARY KEY (`rulebreak_id`),
  ADD KEY `fk_user_id` (`reporter`) USING BTREE;

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `fk_language_id` (`language_id`) USING BTREE;

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT a táblához `languages`
--
ALTER TABLE `languages`
  MODIFY `language_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT a táblához `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=241;

--
-- AUTO_INCREMENT a táblához `rulebreaks`
--
ALTER TABLE `rulebreaks`
  MODIFY `rulebreak_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `groupmembers_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  ADD CONSTRAINT `groupmembers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Megkötések a táblához `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `fk_groupadmin_user` FOREIGN KEY (`groupadmin_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`groupadmin_id`) REFERENCES `users` (`user_id`);

--
-- Megkötések a táblához `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_groupchat_id` FOREIGN KEY (`groupchat`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`reciever`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`groupchat`) REFERENCES `groups` (`group_id`);

--
-- Megkötések a táblához `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user_id` FOREIGN KEY (`reciver_user`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reciver_user` FOREIGN KEY (`reciver_user`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sent_by_user` FOREIGN KEY (`sent_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_sent_to_group` FOREIGN KEY (`sent_to_group`) REFERENCES `groups` (`group_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`reciver_user`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`reciver_user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`sent_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`sent_to_group`) REFERENCES `groups` (`group_id`),
  ADD CONSTRAINT `notifications_ibfk_5` FOREIGN KEY (`sent_to_group`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `rulebreaks`
--
ALTER TABLE `rulebreaks`
  ADD CONSTRAINT `foreignKey_reporter` FOREIGN KEY (`reporter`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_language_id` FOREIGN KEY (`language_id`) REFERENCES `languages` (`language_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`language_id`) REFERENCES `languages` (`language_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
