-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: questionnaire
-- ------------------------------------------------------
-- Server version	5.6.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avoir`
--

DROP TABLE IF EXISTS `avoir`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avoir` (
  `id_q` int(11) NOT NULL,
  `id_rep` int(11) NOT NULL,
  KEY `id_q_avoir` (`id_q`),
  KEY `id_rep` (`id_rep`),
  CONSTRAINT `id_q_avoir` FOREIGN KEY (`id_q`) REFERENCES `question` (`id_q`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_rep` FOREIGN KEY (`id_rep`) REFERENCES `reponse` (`id_rep`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avoir`
--

LOCK TABLES `avoir` WRITE;
/*!40000 ALTER TABLE `avoir` DISABLE KEYS */;
/*!40000 ALTER TABLE `avoir` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compte`
--

DROP TABLE IF EXISTS `compte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `compte` (
  `id_cpt` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo_cpt` varchar(45) DEFAULT NULL,
  `mdp_cpt` varchar(45) DEFAULT NULL,
  `type_cpt` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_cpt`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compte`
--

LOCK TABLES `compte` WRITE;
/*!40000 ALTER TABLE `compte` DISABLE KEYS */;
INSERT INTO `compte` VALUES (1,'admin','1681db84',1),(2,'amina','0583dd9e20',2);
/*!40000 ALTER TABLE `compte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condidat`
--

DROP TABLE IF EXISTS `condidat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `condidat` (
  `id_cdd` int(11) NOT NULL AUTO_INCREMENT,
  `mdp_cdd` varchar(255) DEFAULT NULL,
  `nom_cdd` varchar(45) DEFAULT NULL,
  `prenom_cdd` varchar(45) DEFAULT NULL,
  `email_cdd` varchar(45) DEFAULT NULL,
  `tel_cdd` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_cdd`),
  UNIQUE KEY `tel_cdd_UNIQUE` (`tel_cdd`),
  UNIQUE KEY `email_cdd_UNIQUE` (`email_cdd`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condidat`
--

LOCK TABLES `condidat` WRITE;
/*!40000 ALTER TABLE `condidat` DISABLE KEYS */;
INSERT INTO `condidat` VALUES (3,'0380dd9e2023282165','Chaabane','Wail','kawael09@gmail.com','025417458');
/*!40000 ALTER TABLE `condidat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contient`
--

DROP TABLE IF EXISTS `contient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contient` (
  `id_quest` int(11) NOT NULL,
  `id_q` int(11) NOT NULL,
  KEY `id_quest` (`id_quest`),
  KEY `id_q` (`id_q`),
  CONSTRAINT `id_q` FOREIGN KEY (`id_q`) REFERENCES `question` (`id_q`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_quest` FOREIGN KEY (`id_quest`) REFERENCES `questionnaire` (`id_quest`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contient`
--

LOCK TABLES `contient` WRITE;
/*!40000 ALTER TABLE `contient` DISABLE KEYS */;
/*!40000 ALTER TABLE `contient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creer`
--

DROP TABLE IF EXISTS `creer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `creer` (
  `id_cpt` int(11) NOT NULL,
  `id_cdd` int(11) NOT NULL,
  `date_cre` date NOT NULL,
  KEY `id_cpt` (`id_cpt`),
  KEY `id_cdd` (`id_cdd`),
  CONSTRAINT `id_cdd` FOREIGN KEY (`id_cdd`) REFERENCES `condidat` (`id_cdd`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_cpt` FOREIGN KEY (`id_cpt`) REFERENCES `compte` (`id_cpt`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creer`
--

LOCK TABLES `creer` WRITE;
/*!40000 ALTER TABLE `creer` DISABLE KEYS */;
INSERT INTO `creer` VALUES (2,3,'2015-01-24');
/*!40000 ALTER TABLE `creer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passer`
--

DROP TABLE IF EXISTS `passer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passer` (
  `id_cdd_pass` int(11) NOT NULL,
  `id_quest_pass` int(11) NOT NULL,
  `resultat` varchar(45) DEFAULT NULL,
  `date_pass` date DEFAULT NULL,
  KEY `id_cdd_pass_idx` (`id_cdd_pass`),
  KEY `id_quest_pass_idx` (`id_quest_pass`),
  CONSTRAINT `id_cdd_pass` FOREIGN KEY (`id_cdd_pass`) REFERENCES `condidat` (`id_cdd`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_quest_pass` FOREIGN KEY (`id_quest_pass`) REFERENCES `questionnaire` (`id_quest`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passer`
--

LOCK TABLES `passer` WRITE;
/*!40000 ALTER TABLE `passer` DISABLE KEYS */;
/*!40000 ALTER TABLE `passer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `id_q` int(11) NOT NULL AUTO_INCREMENT,
  `description_q` text,
  `type_q` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_q`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionnaire`
--

DROP TABLE IF EXISTS `questionnaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questionnaire` (
  `id_quest` int(11) NOT NULL AUTO_INCREMENT,
  `date_quest` date NOT NULL,
  `temps_quest` varchar(45) DEFAULT NULL,
  `niveau_quest` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_quest`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionnaire`
--

LOCK TABLES `questionnaire` WRITE;
/*!40000 ALTER TABLE `questionnaire` DISABLE KEYS */;
INSERT INTO `questionnaire` VALUES (1,'2015-02-10','23','AZEZ'),(25,'2015-02-10','23','dxcccccc');
/*!40000 ALTER TABLE `questionnaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reponse`
--

DROP TABLE IF EXISTS `reponse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reponse` (
  `id_rep` int(11) NOT NULL AUTO_INCREMENT,
  `description_rep` varchar(255) DEFAULT NULL,
  `type_rep` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_rep`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reponse`
--

LOCK TABLES `reponse` WRITE;
/*!40000 ALTER TABLE `reponse` DISABLE KEYS */;
/*!40000 ALTER TABLE `reponse` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-02-10 16:47:14
