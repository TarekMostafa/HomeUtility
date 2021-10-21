Create database homeutilityapptestdb;
use homeutilityapptestdb;
-- MySQL dump 10.13  Distrib 5.7.20, for Win32 (AMD64)
--
-- Host: localhost    Database: homeutilityapptestdb
-- ------------------------------------------------------
-- Server version	5.7.20-log

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
INSERT INTO `appsettings` VALUES ('APP',null,'');
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
-- Table structure for table `billitems`
--

DROP TABLE IF EXISTS `billitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `billitems` (
  `billItemId` bigint(20) NOT NULL AUTO_INCREMENT,
  `billItemName` varchar(35) DEFAULT NULL,
  `billId` int(11) DEFAULT NULL,
  PRIMARY KEY (`billItemId`),
  KEY `FK_me81drrbpj15sj8rrr0vnyvul` (`billId`),
  CONSTRAINT `FK_me81drrbpj15sj8rrr0vnyvul` FOREIGN KEY (`billId`) REFERENCES `bills` (`billId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billitems`
--

LOCK TABLES `billitems` WRITE;
/*!40000 ALTER TABLE `billitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `billitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bills` (
  `billId` int(11) NOT NULL AUTO_INCREMENT,
  `billFrequency` varchar(15) DEFAULT NULL,
  `billName` varchar(100) DEFAULT NULL,
  `billStartDate` date DEFAULT NULL,
  `billStatus` enum('ACTIVE','CLOSED') DEFAULT NULL,
  `billCurrency` varchar(3) DEFAULT NULL,
  `billDefaultAmount` double NOT NULL,
  `billLastBillPaidDate` date DEFAULT NULL,
  `billIsTransDetailRequired` bit(1) NOT NULL,
  PRIMARY KEY (`billId`),
  KEY `FK_p5jnywrtdnj7ly4gonjl0anvw` (`billCurrency`),
  CONSTRAINT `FK_p5jnywrtdnj7ly4gonjl0anvw` FOREIGN KEY (`billCurrency`) REFERENCES `currencies` (`currencyCode`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billtransactiondetails`
--

DROP TABLE IF EXISTS `billtransactiondetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `billtransactiondetails` (
  `detId` bigint(20) NOT NULL AUTO_INCREMENT,
  `detAmount` double NOT NULL,
  `detQuantity` int(11) NOT NULL,
  `detAmountType` enum('Credit','Debit') DEFAULT NULL,
  `billItemId` bigint(20) DEFAULT NULL,
  `transId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`detId`),
  KEY `FK_17bi2l4o2urgrawtaq4ee1x4p` (`billItemId`),
  KEY `FK_nlsbo2o5xmsspq5svelbkx526` (`transId`),
  CONSTRAINT `FK_17bi2l4o2urgrawtaq4ee1x4p` FOREIGN KEY (`billItemId`) REFERENCES `billitems` (`billItemId`),
  CONSTRAINT `FK_nlsbo2o5xmsspq5svelbkx526` FOREIGN KEY (`transId`) REFERENCES `billtransactions` (`transId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billtransactiondetails`
--

LOCK TABLES `billtransactiondetails` WRITE;
/*!40000 ALTER TABLE `billtransactiondetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `billtransactiondetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `billtransactions`
--

DROP TABLE IF EXISTS `billtransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `billtransactions` (
  `transId` bigint(20) NOT NULL AUTO_INCREMENT,
  `transAmount` double NOT NULL,
  `transBillDate` date DEFAULT NULL,
  `transNotes` varchar(255) DEFAULT NULL,
  `transOutOfFreq` bit(1) NOT NULL,
  `transAmountType` enum('Credit','Debit') DEFAULT NULL,
  `billId` int(11) DEFAULT NULL,
  `transPostingDate` date DEFAULT NULL,
  `transCurrency` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`transId`),
  KEY `FK_8hqg920j2cgxyvlhvv0bkqvby` (`billId`),
  KEY `fk_billtransdetailccy_idx` (`transCurrency`),
  CONSTRAINT `FK_8hqg920j2cgxyvlhvv0bkqvby` FOREIGN KEY (`billId`) REFERENCES `bills` (`billId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_billtransdetailccy` FOREIGN KEY (`transCurrency`) REFERENCES `currencies` (`currencyCode`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billtransactions`
--

LOCK TABLES `billtransactions` WRITE;
/*!40000 ALTER TABLE `billtransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `billtransactions` ENABLE KEYS */;
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
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `releaseDate` date DEFAULT NULL,
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
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `expenseId` int(11) NOT NULL AUTO_INCREMENT,
  `expenseYear` smallint(4) NOT NULL,
  `expenseMonth` smallint(2) NOT NULL,
  `expenseCurrency` varchar(3) NOT NULL,
  `expenseOpenBalance` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseCloseBalance` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseDebits` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseAdjusments` decimal(18,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`expenseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expensesdetails`
--

DROP TABLE IF EXISTS `expensesdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expensesdetails` (
  `expenseDetailId` bigint(20) NOT NULL AUTO_INCREMENT,
  `expenseId` int(11) NOT NULL,
  `expenseDay` smallint(2) NOT NULL,
  `expenseAmount` decimal(18,3) NOT NULL,
  `expenseCurrency` varchar(3) NOT NULL,
  `expenseDescription` varchar(250) DEFAULT NULL,
  `expenseTypeId` int(11) DEFAULT NULL,
  `expenseAdjusment` tinyint(4) NOT NULL,
  PRIMARY KEY (`expenseDetailId`),
  KEY `fk_expense_idx` (`expenseId`),
  KEY `fk_expensedetails_currency_idx` (`expenseCurrency`),
  KEY `fk_expensedetails_expensetype_idx` (`expenseTypeId`),
  CONSTRAINT `fk_expensedetails_currency` FOREIGN KEY (`expenseCurrency`) REFERENCES `currencies` (`currencyCode`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_expensedetails_expense` FOREIGN KEY (`expenseId`) REFERENCES `expenses` (`expenseId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_expensedetails_expensetype` FOREIGN KEY (`expenseTypeId`) REFERENCES `expensetypes` (`expenseTypeId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expensesdetails`
--

LOCK TABLES `expensesdetails` WRITE;
/*!40000 ALTER TABLE `expensesdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `expensesdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expensetypes`
--

DROP TABLE IF EXISTS `expensetypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expensetypes` (
  `expenseTypeId` int(11) NOT NULL AUTO_INCREMENT,
  `expenseTypeName` varchar(45) NOT NULL,
  PRIMARY KEY (`expenseTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expensetypes`
--

LOCK TABLES `expensetypes` WRITE;
/*!40000 ALTER TABLE `expensetypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `expensetypes` ENABLE KEYS */;
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
  `transactionPostingDate` date NOT NULL,
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
INSERT INTO `users` VALUES (1,'admin','47729eaf9053e25ab469e4c2bf8961147e2939dc6f789bacdfda81d5df44d5e6',1,0,NULL);
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

-- Dump completed on 2021-10-21 17:44:53
