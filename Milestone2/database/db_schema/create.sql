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

-- Dumping structure for table wolfnotes_db.Definition
CREATE TABLE IF NOT EXISTS `Definition` (
  `definitionID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `noteID` int(11) NOT NULL,
  `term` text NOT NULL,
  `definition` longtext NOT NULL,
  PRIMARY KEY (`definitionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of terms and definitions';

-- Dumping data for table wolfnotes_db.Definition: ~0 rows (approximately)

-- Dumping structure for table wolfnotes_db.Note
CREATE TABLE IF NOT EXISTS `Note` (
  `noteID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `dateEdited` datetime NOT NULL,
  `title` text NOT NULL,
  `slideSetDirectory` tinytext DEFAULT NULL,
  `slideCount` int(11) DEFAULT NULL,
  PRIMARY KEY (`noteID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of notes (not including their content) stored in WolfNotes';

-- Dumping data for table wolfnotes_db.Note: ~0 rows (approximately)

-- Dumping structure for table wolfnotes_db.NoteData
CREATE TABLE IF NOT EXISTS `NoteData` (
  `chunkID` int(11) NOT NULL AUTO_INCREMENT,
  `noteID` int(11) NOT NULL,
  `slideNumber` int(11) NOT NULL,
  `contents` longtext NOT NULL,
  PRIMARY KEY (`chunkID`),
  UNIQUE KEY `noteID_slideNumber` (`noteID`,`slideNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='The actual contents of the notes split by "chunks" (1 chunk = 1 slide)';

-- Dumping data for table wolfnotes_db.NoteData: ~0 rows (approximately)

-- Dumping structure for table wolfnotes_db.NoteTag
CREATE TABLE IF NOT EXISTS `NoteTag` (
  `ntID` int(11) NOT NULL AUTO_INCREMENT,
  `noteID` int(11) NOT NULL,
  `tagID` int(11) NOT NULL,
  PRIMARY KEY (`ntID`),
  UNIQUE KEY `noteID_tagID` (`noteID`,`tagID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A database to represent the many-to-many relationship between notes and tags';

-- Dumping data for table wolfnotes_db.NoteTag: ~0 rows (approximately)

-- Dumping structure for table wolfnotes_db.Shorthand
CREATE TABLE IF NOT EXISTS `Shorthand` (
  `shorthandID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `short` text NOT NULL,
  `expanded` text NOT NULL,
  PRIMARY KEY (`shorthandID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of shorthand expansions per-user';

-- Dumping data for table wolfnotes_db.Shorthand: ~0 rows (approximately)

-- Dumping structure for table wolfnotes_db.slideImages
CREATE TABLE IF NOT EXISTS `slideImages` (
  `noteID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `slideNumber` int(11) NOT NULL,
  `slide` text NOT NULL,
  `thumbnail` text NOT NULL,
  PRIMARY KEY (`noteID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table wolfnotes_db.slideImages: ~0 rows (approximately)

-- Dumping structure for table wolfnotes_db.Tag
CREATE TABLE IF NOT EXISTS `Tag` (
  `tagID` int(11) NOT NULL AUTO_INCREMENT,
  `tagName` text NOT NULL,
  `userID` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`tagID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of tags to be applied to notes';

-- Dumping data for table wolfnotes_db.Tag: ~0 rows (approximately)

-- Dumping structure for table wolfnotes_db.User
CREATE TABLE IF NOT EXISTS `User` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `userName` text NOT NULL,
  `avatar` text NOT NULL,
  `passwordHash` text NOT NULL,
  `salt` text NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userName` (`userName`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='A list of WolfNotes users';

-- Dumping data for table wolfnotes_db.User: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
