-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.15-MariaDB-1:10.6.15+maria~ubu2004 - mariadb.org binary distribution
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for wolfnotes_db
CREATE DATABASE IF NOT EXISTS `wolfnotes_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `wolfnotes_db`;

-- Dumping structure for table wolfnotes_db.Definition
CREATE TABLE IF NOT EXISTS `Definition` (
  `definitionID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `noteID` int(11) NOT NULL,
  `term` text NOT NULL,
  `definition` longtext NOT NULL,
  PRIMARY KEY (`definitionID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of terms and definitions';

-- Dumping data for table wolfnotes_db.Definition: ~9 rows (approximately)
INSERT INTO `Definition` (`definitionID`, `userID`, `noteID`, `term`, `definition`) VALUES
	(1, 3, 4, 'Scalability', 'can we aggregate resources and get more power gradually, as we add more resources'),
	(2, 3, 4, 'Robustness', 'can we tolerate failure of individual components(hosts,software,network)'),
	(3, 3, 4, 'Availiabilty', 'are data services always there for clients'),
	(4, 3, 4, 'Heterogeneity', 'differernt types of hosts and devices can cooperate,including differences in byte order,instruction set, computational speed'),
	(5, 1, 2, 'Resource sharing', 'access remote servers, special-purpose devices,etc'),
	(6, 1, 2, 'Computational speedup', 'sharing computational load'),
	(7, 1, 2, 'Reliability', 'detect and recover from a failed host,'),
	(8, 2, 1, 'Communication', 'between users on different systems'),
	(9, 2, 1, 'Cost effectiveness', 'aggregation of inexpensive');

-- Dumping structure for table wolfnotes_db.Note
CREATE TABLE IF NOT EXISTS `Note` (
  `noteID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `dateEdited` datetime NOT NULL,
  `title` text NOT NULL,
  `slideSetDirectory` tinytext DEFAULT NULL,
  `slideCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`noteID`),
  CONSTRAINT `FK_Note_NoteData` FOREIGN KEY (`noteID`) REFERENCES `NoteData` (`noteID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_Note_NoteTag` FOREIGN KEY (`noteID`) REFERENCES `NoteTag` (`noteID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of notes (not including their content) stored in WolfNotes';

-- Dumping data for table wolfnotes_db.Note: ~2 rows (approximately)
INSERT INTO `Note` (`noteID`, `userID`, `dateEdited`, `title`, `slideSetDirectory`, `slideCount`) VALUES
	(1, 1, '2023-11-09 16:48:49', 'OS', NULL, 2),
	(2, 2, '2023-11-09 16:50:21', 'Biology', NULL, NULL);

-- Dumping structure for table wolfnotes_db.NoteData
CREATE TABLE IF NOT EXISTS `NoteData` (
  `chunkID` int(11) NOT NULL AUTO_INCREMENT,
  `noteID` int(11) NOT NULL,
  `slideNumber` int(11) NOT NULL,
  `contents` longtext NOT NULL,
  PRIMARY KEY (`chunkID`),
  UNIQUE KEY `noteID_slideNumber` (`noteID`,`slideNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='The actual contents of the notes split by "chunks" (1 chunk = 1 slide)';

-- Dumping data for table wolfnotes_db.NoteData: ~5 rows (approximately)
INSERT INTO `NoteData` (`chunkID`, `noteID`, `slideNumber`, `contents`) VALUES
	(1, 1, 2, 'cal'),
	(2, 1, 3, 'OS'),
	(3, 2, 2, 'chem'),
	(4, 2, 3, 'Biology'),
	(5, 3, 3, 'Eng');

-- Dumping structure for table wolfnotes_db.NoteTag
CREATE TABLE IF NOT EXISTS `NoteTag` (
  `ntID` int(11) NOT NULL AUTO_INCREMENT,
  `noteID` int(11) NOT NULL,
  `tagID` int(11) NOT NULL,
  PRIMARY KEY (`ntID`),
  UNIQUE KEY `noteID_tagID` (`noteID`,`tagID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A database to represent the many-to-many relationship between notes and tags';

-- Dumping data for table wolfnotes_db.NoteTag: ~5 rows (approximately)
INSERT INTO `NoteTag` (`ntID`, `noteID`, `tagID`) VALUES
	(1, 1, 1),
	(2, 1, 3),
	(4, 1, 4),
	(3, 1, 5),
	(5, 2, 3);

-- Dumping structure for table wolfnotes_db.Shorthand
CREATE TABLE IF NOT EXISTS `Shorthand` (
  `shorthandID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `short` text NOT NULL,
  `expanded` text NOT NULL,
  PRIMARY KEY (`shorthandID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of shorthand expansions per-user';

-- Dumping data for table wolfnotes_db.Shorthand: ~8 rows (approximately)
INSERT INTO `Shorthand` (`shorthandID`, `userID`, `short`, `expanded`) VALUES
	(1, 1, 'w/o', 'without'),
	(2, 1, 'ASAP', 'As Soon As Possible'),
	(3, 1, 'e.g.', 'For example'),
	(4, 2, 'i.e.', 'That is'),
	(5, 2, 'b/c ', ' Because'),
	(6, 2, 'w/ ', 'With'),
	(7, 2, 'w/i ', 'Within'),
	(8, 3, '& ', 'And');

-- Dumping structure for table wolfnotes_db.SlideImage
CREATE TABLE IF NOT EXISTS `SlideImage` (
  `slideNumber` int(11) NOT NULL,
  `noteID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `slide` text NOT NULL,
  `thumbnail` text NOT NULL,
  PRIMARY KEY (`slideNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table wolfnotes_db.SlideImage: ~4 rows (approximately)
INSERT INTO `SlideImage` (`slideNumber`, `noteID`, `userID`, `slide`, `thumbnail`) VALUES
	(1, 1, 1, 'slide1', 'thumbnail1'),
	(2, 1, 1, 'slide2', 'thumbnail2'),
	(3, 2, 2, 'slide3', 'thumbnail2'),
	(4, 2, 2, 'slide4', 'thumbnail3');

-- Dumping structure for table wolfnotes_db.Tag
CREATE TABLE IF NOT EXISTS `Tag` (
  `tagID` int(11) NOT NULL AUTO_INCREMENT,
  `tagName` text NOT NULL,
  `userID` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tagID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of tags to be applied to notes';

-- Dumping data for table wolfnotes_db.Tag: ~5 rows (approximately)
INSERT INTO `Tag` (`tagID`, `tagName`, `userID`) VALUES
	(1, 'os', 1),
	(2, 'biology', 1),
	(3, 'chem', 1),
	(4, 'eng', 2),
	(5, 'cal', 3);

-- Dumping structure for table wolfnotes_db.User
CREATE TABLE IF NOT EXISTS `User` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `userName` text NOT NULL,
  `avatar` text DEFAULT NULL,
  `passwordHash` text NOT NULL,
  `salt` text NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userName` (`userName`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of WolfNotes users';

-- Dumping data for table wolfnotes_db.User: ~3 rows (approximately)
INSERT INTO `User` (`userID`, `userName`, `avatar`, `passwordHash`, `salt`) VALUES
	(1, 'john_doe', 'image', 'hashed_password_1\'', 'salt'),
	(2, 'jane_smith', 'image', 'hashed_password_2', 'salt'),
	(3, 'bob_johnson', 'image', 'hashed_password_3', 'salt');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
