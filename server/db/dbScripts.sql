Create database homeutilitytestdb;
use homeutilitytestdb;

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `accountId` int(11) NOT NULL AUTO_INCREMENT,
  `accountNumber` varchar(20) NOT NULL,
  `accountCurrentBalance` decimal(18,3) NOT NULL,
  `accountLastBalanceUpdate` datetime DEFAULT NULL,
  `accountStartBalance` decimal(18,3) NOT NULL,
  `accountStatus` enum('ACTIVE','CLOSED') NOT NULL,
  `accountBankCode` varchar(3) NOT NULL,
  `accountCurrency` varchar(3) NOT NULL,
  `accountUser` int(11) NOT NULL,
  PRIMARY KEY (`accountId`),
  KEY `accountBankCode_idx` (`accountBankCode`),
  KEY `accountUser_fk_idx` (`accountUser`),
  KEY `accountCurrency_fk_idx` (`accountCurrency`),
  CONSTRAINT `accountBank_fk` FOREIGN KEY (`accountBankCode`) REFERENCES `banks` (`bankCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `accountCurrency_fk` FOREIGN KEY (`accountCurrency`) REFERENCES `currencies` (`currencyCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `accountUser_fk` FOREIGN KEY (`accountUser`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appsettings`
--

DROP TABLE IF EXISTS `appsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appsettings` (
  `appCode` varchar(3) NOT NULL,
  `baseCurrency` varchar(3) DEFAULT NULL,
  `currencyConversionAPIKey` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`appCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appsettings`
--

LOCK TABLES `appsettings` WRITE;
/*!40000 ALTER TABLE `appsettings` DISABLE KEYS */;
insert into appsettings values ('APP', null, '');
/*!40000 ALTER TABLE `appsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks`
--

DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banks` (
  `bankCode` varchar(3) NOT NULL,
  `bankName` varchar(45) NOT NULL,
  PRIMARY KEY (`bankCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banks`
--

LOCK TABLES `banks` WRITE;
/*!40000 ALTER TABLE `banks` DISABLE KEYS */;
/*!40000 ALTER TABLE `banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `currencies` (
  `currencyCode` varchar(3) NOT NULL,
  `currencyName` varchar(45) NOT NULL,
  `currencyActive` enum('YES','NO') NOT NULL,
  `currencyRateAgainstBase` decimal(18,7) NOT NULL,
  `currencyDecimalPlace` tinyint(1) NOT NULL,
  PRIMARY KEY (`currencyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deposits`
--

DROP TABLE IF EXISTS `deposits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deposits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(30) NOT NULL,
  `amount` decimal(18,3) NOT NULL,
  `status` enum('ACTIVE','CLOSED') NOT NULL,
  `rate` decimal(18,7) NOT NULL,
  `bankCode` varchar(3) NOT NULL,
  `accountId` int(11) NOT NULL,
  `currencyCode` varchar(3) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `releaseDate` datetime DEFAULT NULL,
  `originalTransId` bigint(20) DEFAULT NULL,
  `relatedId` bigint(20) DEFAULT NULL,
  `interestTransType` int(11) DEFAULT NULL,
  `releaseTransId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bankCode_idx` (`bankCode`),
  KEY `fk_account_idx` (`accountId`),
  KEY `fk_currency_idx` (`currencyCode`),
  KEY `fk_originalTransId_idx` (`originalTransId`),
  KEY `fk_relatedTransId_idx` (`relatedId`),
  KEY `fk_interestType_idx` (`interestTransType`),
  CONSTRAINT `fk_account` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_bankCode` FOREIGN KEY (`bankCode`) REFERENCES `banks` (`bankCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_currency` FOREIGN KEY (`currencyCode`) REFERENCES `currencies` (`currencyCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_interestType` FOREIGN KEY (`interestTransType`) REFERENCES `transactiontypes` (`typeId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_originalTransId` FOREIGN KEY (`originalTransId`) REFERENCES `transactions` (`transactionId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_relatedTransId` FOREIGN KEY (`relatedId`) REFERENCES `relatedtransactions` (`relatedTransactionsId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deposits`
--

LOCK TABLES `deposits` WRITE;
/*!40000 ALTER TABLE `deposits` DISABLE KEYS */;
/*!40000 ALTER TABLE `deposits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relatedtransactions`
--

DROP TABLE IF EXISTS `relatedtransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relatedtransactions` (
  `relatedTransactionsId` bigint(20) NOT NULL AUTO_INCREMENT,
  `relatedTransactionType` varchar(3) NOT NULL,
  `relatedTransactionDesc` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`relatedTransactionsId`),
  KEY `relatedType_fk_idx` (`relatedTransactionType`),
  CONSTRAINT `relatedType_fk` FOREIGN KEY (`relatedTransactionType`) REFERENCES `relatedtypes` (`typeCode`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relatedtransactions`
--

LOCK TABLES `relatedtransactions` WRITE;
/*!40000 ALTER TABLE `relatedtransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `relatedtransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relatedtypes`
--

DROP TABLE IF EXISTS `relatedtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relatedtypes` (
  `typeCode` varchar(3) NOT NULL,
  `typeDescription` varchar(45) NOT NULL,
  PRIMARY KEY (`typeCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relatedtypes`
--

LOCK TABLES `relatedtypes` WRITE;
/*!40000 ALTER TABLE `relatedtypes` DISABLE KEYS */;
INSERT INTO `relatedtypes` VALUES ('DEP','Deposit Related Transactions'),('IAT','Internal Account Transfer');
/*!40000 ALTER TABLE `relatedtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportdetails`
--

DROP TABLE IF EXISTS `reportdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reportdetails` (
  `detailId` int(11) NOT NULL AUTO_INCREMENT,
  `detailReportId` int(11) NOT NULL,
  `detailName` varchar(45) NOT NULL,
  `detailTypes` varchar(200) NOT NULL,
  PRIMARY KEY (`detailId`),
  KEY `reportDetails_fk_idx` (`detailReportId`),
  CONSTRAINT `reportDetails_fk` FOREIGN KEY (`detailReportId`) REFERENCES `reports` (`reportId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportdetails`
--

LOCK TABLES `reportdetails` WRITE;
/*!40000 ALTER TABLE `reportdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `reportdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `reportId` int(11) NOT NULL AUTO_INCREMENT,
  `reportName` varchar(45) NOT NULL,
  `reportActive` enum('YES','NO') NOT NULL,
  PRIMARY KEY (`reportId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `transactionId` bigint(20) NOT NULL AUTO_INCREMENT,
  `transactionAmount` decimal(18,3) NOT NULL,
  `transactionNarrative` varchar(200) DEFAULT NULL,
  `transactionPostingDate` datetime NOT NULL,
  `transactionCRDR` enum('Credit','Debit') NOT NULL,
  `transactionAccount` int(11) NOT NULL,
  `transactionTypeId` int(11) DEFAULT NULL,
  `transactionRelatedTransactionId` bigint(20) DEFAULT NULL,
  `transactionModule` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`transactionId`),
  KEY `transactionAccount_fk_idx` (`transactionAccount`),
  KEY `transactionType_fk_idx` (`transactionTypeId`),
  KEY `transactionRelatedTransactionfk_idx` (`transactionRelatedTransactionId`),
  CONSTRAINT `transactionAccountfk` FOREIGN KEY (`transactionAccount`) REFERENCES `accounts` (`accountId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `transactionRelatedTransactionfk` FOREIGN KEY (`transactionRelatedTransactionId`) REFERENCES `relatedtransactions` (`relatedTransactionsId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `transactiontypefk` FOREIGN KEY (`transactionTypeId`) REFERENCES `transactiontypes` (`typeId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactiontypes`
--

DROP TABLE IF EXISTS `transactiontypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactiontypes` (
  `typeId` int(11) NOT NULL AUTO_INCREMENT,
  `typeName` varchar(45) NOT NULL,
  `typeCRDR` enum('Credit','Debit') NOT NULL,
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactiontypes`
--

LOCK TABLES `transactiontypes` WRITE;
/*!40000 ALTER TABLE `transactiontypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactiontypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(20) NOT NULL,
  `userPassword` varchar(64) NOT NULL,
  `userActive` bit(1) NOT NULL,
  `userAttempt` int(11) NOT NULL,
  `userToken` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
insert into users values (1, 'admin', '47729eaf9053e25ab469e4c2bf8961147e2939dc6f789bacdfda81d5df44d5e6', 1, 0, NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-04 15:55:47
