Create database homeutilityapptestdb;
use homeutilityapptestdb;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: homeutilityapptestdb
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `accountId` int NOT NULL AUTO_INCREMENT,
  `accountNumber` varchar(20) NOT NULL,
  `accountCurrentBalance` decimal(18,3) NOT NULL,
  `accountLastBalanceUpdate` datetime DEFAULT NULL,
  `accountStartBalance` decimal(18,3) NOT NULL,
  `accountStatus` enum('ACTIVE','CLOSED') NOT NULL,
  `accountBankCode` varchar(3) NOT NULL,
  `accountCurrency` varchar(3) NOT NULL,
  `accountUser` int NOT NULL,
  PRIMARY KEY (`accountId`),
  KEY `accountBankCode_idx` (`accountBankCode`),
  KEY `accountUser_fk_idx` (`accountUser`),
  KEY `accountCurrency_fk_idx` (`accountCurrency`),
  CONSTRAINT `accountBank_fk` FOREIGN KEY (`accountBankCode`) REFERENCES `banks` (`bankCode`),
  CONSTRAINT `accountCurrency_fk` FOREIGN KEY (`accountCurrency`) REFERENCES `currencies` (`currencyCode`),
  CONSTRAINT `accountUser_fk` FOREIGN KEY (`accountUser`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applog`
--

DROP TABLE IF EXISTS `applog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applog` (
  `logId` int NOT NULL AUTO_INCREMENT,
  `logUserId` int NOT NULL,
  `logUserName` varchar(20) NOT NULL,
  `logMethod` varchar(10) NOT NULL,
  `logPathName` varchar(200) NOT NULL,
  `logReqQuery` varchar(200) DEFAULT NULL,
  `logReqBody` varchar(1000) DEFAULT NULL,
  `logReqTimestamp` timestamp NOT NULL,
  `logResStatus` enum('SUCCESS','FAILED') DEFAULT NULL,
  `logResStatusCode` varchar(5) DEFAULT NULL,
  `logResErrorMsg` varchar(1000) DEFAULT NULL,
  `logResTimestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`logId`),
  KEY `loggerUser_fk_idx` (`logUserId`),
  CONSTRAINT `loggerUser_fk` FOREIGN KEY (`logUserId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applog`
--

LOCK TABLES `applog` WRITE;
/*!40000 ALTER TABLE `applog` DISABLE KEYS */;
/*!40000 ALTER TABLE `applog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appparameters`
--

DROP TABLE IF EXISTS `appparameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appparameters` (
  `paramName` varchar(45) NOT NULL,
  `paramValue` varchar(45) DEFAULT NULL,
  `paramDescription` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`paramName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appparameters`
--

LOCK TABLES `appparameters` WRITE;
/*!40000 ALTER TABLE `appparameters` DISABLE KEYS */;
INSERT INTO `appparameters` VALUES ('automaticOrManualRate','Automatic','Automatic or Manual Rate'),('baseCurrency','EGP','App Base Currency'),('currencyConversionAPIKey','a903b6f2d1ec2e4fc61c','Automatic Currency Rate API Key'),('debtTransacionDebit','15','Debt Transaction Debit'),('debtTransactionCredit','14','Debt Transaction Credit'),('fxTransactionTypeFrom','17','FX Transaction Type From'),('fxTransactionTypeTo','16','FX Transaction Type To'),('internalTransactionTypeFrom','9','Internal Transaction Type From'),('internalTransactionTypeTo','10','Internal Transaction Type To'),('linkModulesToDebtors','CRD','Link Modules To Debtors');
/*!40000 ALTER TABLE `appparameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks`
--

DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banks` (
  `bankCode` varchar(3) NOT NULL,
  `bankName` varchar(45) NOT NULL,
  PRIMARY KEY (`bankCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billitems` (
  `billItemId` bigint NOT NULL AUTO_INCREMENT,
  `billItemName` varchar(35) DEFAULT NULL,
  `billId` int DEFAULT NULL,
  PRIMARY KEY (`billItemId`),
  KEY `FK_me81drrbpj15sj8rrr0vnyvul` (`billId`),
  CONSTRAINT `FK_me81drrbpj15sj8rrr0vnyvul` FOREIGN KEY (`billId`) REFERENCES `bills` (`billId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `billId` int NOT NULL AUTO_INCREMENT,
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
  CONSTRAINT `FK_p5jnywrtdnj7ly4gonjl0anvw` FOREIGN KEY (`billCurrency`) REFERENCES `currencies` (`currencyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billtransactiondetails` (
  `detId` bigint NOT NULL AUTO_INCREMENT,
  `detAmount` double NOT NULL,
  `detQuantity` int NOT NULL,
  `detAmountType` enum('Credit','Debit') DEFAULT NULL,
  `billItemId` bigint DEFAULT NULL,
  `transId` bigint DEFAULT NULL,
  PRIMARY KEY (`detId`),
  KEY `FK_17bi2l4o2urgrawtaq4ee1x4p` (`billItemId`),
  KEY `FK_nlsbo2o5xmsspq5svelbkx526` (`transId`),
  CONSTRAINT `FK_17bi2l4o2urgrawtaq4ee1x4p` FOREIGN KEY (`billItemId`) REFERENCES `billitems` (`billItemId`),
  CONSTRAINT `FK_nlsbo2o5xmsspq5svelbkx526` FOREIGN KEY (`transId`) REFERENCES `billtransactions` (`transId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `billtransactions` (
  `transId` bigint NOT NULL AUTO_INCREMENT,
  `transAmount` double NOT NULL,
  `transBillDate` date DEFAULT NULL,
  `transNotes` varchar(255) DEFAULT NULL,
  `transOutOfFreq` bit(1) NOT NULL,
  `transAmountType` enum('Credit','Debit') DEFAULT NULL,
  `billId` int DEFAULT NULL,
  `transPostingDate` date DEFAULT NULL,
  `transCurrency` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`transId`),
  KEY `FK_8hqg920j2cgxyvlhvv0bkqvby` (`billId`),
  KEY `fk_billtransdetailccy_idx` (`transCurrency`),
  CONSTRAINT `FK_8hqg920j2cgxyvlhvv0bkqvby` FOREIGN KEY (`billId`) REFERENCES `bills` (`billId`),
  CONSTRAINT `fk_billtransdetailccy` FOREIGN KEY (`transCurrency`) REFERENCES `currencies` (`currencyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `billtransactions`
--

LOCK TABLES `billtransactions` WRITE;
/*!40000 ALTER TABLE `billtransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `billtransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cardinstallments`
--

DROP TABLE IF EXISTS `cardinstallments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cardinstallments` (
  `cInstId` bigint NOT NULL AUTO_INCREMENT,
  `cardId` int NOT NULL,
  `cInstCurrency` varchar(3) NOT NULL,
  `cInstItemDesc` varchar(200) NOT NULL,
  `cInstPurchaseDate` date NOT NULL,
  `cInstFirstInstDate` date DEFAULT NULL,
  `cInstNoOfInst` smallint NOT NULL,
  `cInstPrice` decimal(18,3) NOT NULL,
  `cInstNoOfPostedInst` smallint NOT NULL DEFAULT '0',
  `cInstPosted` decimal(18,3) NOT NULL DEFAULT '0.000',
  `cInstRelTransId` bigint DEFAULT NULL,
  `cInstStatus` enum('NEW','ACTIVE','FINISHED') NOT NULL,
  PRIMARY KEY (`cInstId`),
  KEY `fk_cardInst_card_idx` (`cardId`),
  KEY `fk_cardInst_currency_idx` (`cInstCurrency`),
  KEY `fk_cardInst_relTrans_idx` (`cInstRelTransId`),
  CONSTRAINT `fk_cardInst_card` FOREIGN KEY (`cardId`) REFERENCES `cards` (`cardId`),
  CONSTRAINT `fk_cardInst_currency` FOREIGN KEY (`cInstCurrency`) REFERENCES `currencies` (`currencyCode`),
  CONSTRAINT `fk_cardInst_relTrans` FOREIGN KEY (`cInstRelTransId`) REFERENCES `relatedtransactions` (`relatedTransactionsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cardinstallments`
--

LOCK TABLES `cardinstallments` WRITE;
/*!40000 ALTER TABLE `cardinstallments` DISABLE KEYS */;
/*!40000 ALTER TABLE `cardinstallments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `cardId` int NOT NULL AUTO_INCREMENT,
  `cardNumber` varchar(20) NOT NULL,
  `cardLimit` decimal(18,3) NOT NULL,
  `cardBalance` decimal(18,3) NOT NULL,
  `cardStatus` enum('ACTIVE','CLOSED') NOT NULL,
  `cardBank` varchar(3) NOT NULL,
  `cardCurrency` varchar(3) NOT NULL,
  `cardStartDate` date NOT NULL,
  `cardExpiryDate` date NOT NULL,
  `cardLastBalanceUpdate` datetime DEFAULT NULL,
  PRIMARY KEY (`cardId`),
  KEY `fk_card_bank_idx` (`cardBank`),
  KEY `fk_card_currency_idx` (`cardCurrency`),
  CONSTRAINT `fk_card_bank` FOREIGN KEY (`cardBank`) REFERENCES `banks` (`bankCode`),
  CONSTRAINT `fk_card_currency` FOREIGN KEY (`cardCurrency`) REFERENCES `currencies` (`currencyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cardtransactions`
--

DROP TABLE IF EXISTS `cardtransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cardtransactions` (
  `cardTransId` bigint NOT NULL AUTO_INCREMENT,
  `cardId` int NOT NULL,
  `cardTransAmount` decimal(18,3) NOT NULL,
  `cardTransCurrency` varchar(3) NOT NULL,
  `cardTransDate` date NOT NULL,
  `cardTransDesc` varchar(150) NOT NULL,
  `cardTransBillAmount` decimal(18,3) NOT NULL,
  `cardTransBillDate` date DEFAULT NULL,
  `cardTransIsInstallment` bit(1) NOT NULL DEFAULT b'0',
  `cardTransAccountTransId` bigint DEFAULT NULL,
  `cardTransInstallmentId` bigint DEFAULT NULL,
  `cardTransIsPaid` bit(1) NOT NULL DEFAULT b'0',
  `cardTransPayForOthers` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`cardTransId`),
  KEY `fk_cardTrans_cards_idx` (`cardId`),
  KEY `fk_cardTrans_currency_idx` (`cardTransCurrency`),
  KEY `fk_cardTrans_TransId_idx` (`cardTransAccountTransId`),
  KEY `fk_cardTrans_cardInst_idx` (`cardTransInstallmentId`),
  CONSTRAINT `fk_cardTrans_cardInst` FOREIGN KEY (`cardTransInstallmentId`) REFERENCES `cardinstallments` (`cInstId`),
  CONSTRAINT `fk_cardTrans_cards` FOREIGN KEY (`cardId`) REFERENCES `cards` (`cardId`),
  CONSTRAINT `fk_cardTrans_currency` FOREIGN KEY (`cardTransCurrency`) REFERENCES `currencies` (`currencyCode`),
  CONSTRAINT `fk_cardTrans_TransId` FOREIGN KEY (`cardTransAccountTransId`) REFERENCES `transactions` (`transactionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cardtransactions`
--

LOCK TABLES `cardtransactions` WRITE;
/*!40000 ALTER TABLE `cardtransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `cardtransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currencies`
--

DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `currencyCode` varchar(3) NOT NULL,
  `currencyName` varchar(45) NOT NULL,
  `currencyActive` enum('YES','NO') NOT NULL,
  `currencyRateAgainstBase` decimal(18,7) NOT NULL,
  `currencyDecimalPlace` tinyint(1) NOT NULL,
  `currencyManualRateAgainstBase` decimal(18,7) NOT NULL,
  PRIMARY KEY (`currencyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currencies`
--

LOCK TABLES `currencies` WRITE;
/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `debtors`
--

DROP TABLE IF EXISTS `debtors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `debtors` (
  `debtId` int NOT NULL AUTO_INCREMENT,
  `debtName` varchar(50) NOT NULL,
  `debtCurrency` varchar(3) NOT NULL,
  `debtBalance` decimal(18,3) NOT NULL,
  `debtStatus` enum('ACTIVE','CLOSED') NOT NULL,
  `debtNotes` varchar(200) DEFAULT NULL,
  `debtLastBalanceUpdate` datetime DEFAULT NULL,
  `debtRelId` bigint DEFAULT NULL,
  PRIMARY KEY (`debtId`),
  KEY `fk_debtor_currency_idx` (`debtCurrency`),
  KEY `fk_debtor_relTrans_idx` (`debtRelId`),
  CONSTRAINT `fk_debtor_currency` FOREIGN KEY (`debtCurrency`) REFERENCES `currencies` (`currencyCode`),
  CONSTRAINT `fk_debtor_relTrans` FOREIGN KEY (`debtRelId`) REFERENCES `relatedtransactions` (`relatedTransactionsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debtors`
--

LOCK TABLES `debtors` WRITE;
/*!40000 ALTER TABLE `debtors` DISABLE KEYS */;
/*!40000 ALTER TABLE `debtors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deposits`
--

DROP TABLE IF EXISTS `deposits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deposits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reference` varchar(30) NOT NULL,
  `amount` decimal(18,3) NOT NULL,
  `status` enum('ACTIVE','CLOSED') NOT NULL,
  `rate` decimal(18,7) NOT NULL,
  `bankCode` varchar(3) NOT NULL,
  `accountId` int NOT NULL,
  `currencyCode` varchar(3) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `releaseDate` date DEFAULT NULL,
  `originalTransId` bigint DEFAULT NULL,
  `relatedId` bigint DEFAULT NULL,
  `interestTransType` int DEFAULT NULL,
  `releaseTransId` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bankCode_idx` (`bankCode`),
  KEY `fk_account_idx` (`accountId`),
  KEY `fk_currency_idx` (`currencyCode`),
  KEY `fk_originalTransId_idx` (`originalTransId`),
  KEY `fk_relatedTransId_idx` (`relatedId`),
  KEY `fk_interestType_idx` (`interestTransType`),
  CONSTRAINT `fk_account` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`),
  CONSTRAINT `fk_bankCode` FOREIGN KEY (`bankCode`) REFERENCES `banks` (`bankCode`),
  CONSTRAINT `fk_currency` FOREIGN KEY (`currencyCode`) REFERENCES `currencies` (`currencyCode`),
  CONSTRAINT `fk_interestType` FOREIGN KEY (`interestTransType`) REFERENCES `transactiontypes` (`typeId`),
  CONSTRAINT `fk_originalTransId` FOREIGN KEY (`originalTransId`) REFERENCES `transactions` (`transactionId`),
  CONSTRAINT `fk_relatedTransId` FOREIGN KEY (`relatedId`) REFERENCES `relatedtransactions` (`relatedTransactionsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `expenseId` int NOT NULL AUTO_INCREMENT,
  `expenseYear` smallint NOT NULL,
  `expenseMonth` smallint NOT NULL,
  `expenseCurrency` varchar(3) NOT NULL,
  `expenseOpenBalance` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseCalculatedBalance` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseDebits` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseAdjusments` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseTotalAccountDebit` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseDebitTransTypes` varchar(200) DEFAULT NULL,
  `expenseCloseBalance` decimal(18,3) NOT NULL DEFAULT '0.000',
  `expenseStatus` enum('ACTIVE','CLOSED') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`expenseId`),
  KEY `fk_expenses_currency_idx` (`expenseCurrency`),
  CONSTRAINT `fk_expenses_currency` FOREIGN KEY (`expenseCurrency`) REFERENCES `currencies` (`currencyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expensesdetails` (
  `expenseDetailId` bigint NOT NULL AUTO_INCREMENT,
  `expenseId` int NOT NULL,
  `expenseDay` smallint NOT NULL,
  `expenseAmount` decimal(18,3) NOT NULL,
  `expenseCurrency` varchar(3) NOT NULL,
  `expenseDescription` varchar(250) DEFAULT NULL,
  `expenseTypeId` int DEFAULT NULL,
  `expenseAdjusment` tinyint NOT NULL,
  `expenseDate` date NOT NULL DEFAULT '0001-01-01',
  PRIMARY KEY (`expenseDetailId`),
  KEY `fk_expense_idx` (`expenseId`),
  KEY `fk_expensedetails_currency_idx` (`expenseCurrency`),
  KEY `fk_expensedetails_expensetype_idx` (`expenseTypeId`),
  CONSTRAINT `fk_expensedetails_currency` FOREIGN KEY (`expenseCurrency`) REFERENCES `currencies` (`currencyCode`),
  CONSTRAINT `fk_expensedetails_expense` FOREIGN KEY (`expenseId`) REFERENCES `expenses` (`expenseId`),
  CONSTRAINT `fk_expensedetails_expensetype` FOREIGN KEY (`expenseTypeId`) REFERENCES `expensetypes` (`expenseTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expensetypes` (
  `expenseTypeId` int NOT NULL AUTO_INCREMENT,
  `expenseTypeName` varchar(45) NOT NULL,
  PRIMARY KEY (`expenseTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expensetypes`
--

LOCK TABLES `expensetypes` WRITE;
/*!40000 ALTER TABLE `expensetypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `expensetypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fxtransactions`
--

DROP TABLE IF EXISTS `fxtransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fxtransactions` (
  `fxId` bigint NOT NULL AUTO_INCREMENT,
  `fxRelTransId` bigint NOT NULL,
  `fxAmountFrom` decimal(18,3) NOT NULL,
  `fxAmountTo` decimal(18,3) NOT NULL,
  `fxPostingDateFrom` date NOT NULL,
  `fxRate` decimal(12,7) NOT NULL,
  `fxAccountFrom` int NOT NULL,
  `fxAccountTo` int NOT NULL,
  `fxCurrencyFrom` varchar(3) NOT NULL,
  `fxCurrencyTo` varchar(3) NOT NULL,
  `fxPostingDateTo` date NOT NULL,
  PRIMARY KEY (`fxId`),
  KEY `fxRelatedTransactionfk_idx` (`fxRelTransId`),
  KEY `fxAccountFromfk_idx` (`fxAccountFrom`),
  KEY `fxAccountTofk_idx` (`fxAccountTo`),
  CONSTRAINT `fxAccountFromfk` FOREIGN KEY (`fxAccountFrom`) REFERENCES `accounts` (`accountId`),
  CONSTRAINT `fxAccountTofk` FOREIGN KEY (`fxAccountTo`) REFERENCES `accounts` (`accountId`),
  CONSTRAINT `fxRelatedTransactionfk` FOREIGN KEY (`fxRelTransId`) REFERENCES `relatedtransactions` (`relatedTransactionsId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fxtransactions`
--

LOCK TABLES `fxtransactions` WRITE;
/*!40000 ALTER TABLE `fxtransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `fxtransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relatedtransactions`
--

DROP TABLE IF EXISTS `relatedtransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relatedtransactions` (
  `relatedTransactionsId` bigint NOT NULL AUTO_INCREMENT,
  `relatedTransactionType` varchar(3) NOT NULL,
  `relatedTransactionDesc` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`relatedTransactionsId`),
  KEY `relatedType_fk_idx` (`relatedTransactionType`),
  CONSTRAINT `relatedType_fk` FOREIGN KEY (`relatedTransactionType`) REFERENCES `relatedtypes` (`typeCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relatedtypes` (
  `typeCode` varchar(3) NOT NULL,
  `typeDescription` varchar(45) NOT NULL,
  PRIMARY KEY (`typeCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relatedtypes`
--

LOCK TABLES `relatedtypes` WRITE;
/*!40000 ALTER TABLE `relatedtypes` DISABLE KEYS */;
INSERT INTO `relatedtypes` VALUES ('CRI','Card Related Installments'),('DBT','Debt Related Transactions'),('DEP','Deposit Related Transactions'),('FX','FX Related Transactions'),('IAT','Internal Account Transfer');
/*!40000 ALTER TABLE `relatedtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reportdetails`
--

DROP TABLE IF EXISTS `reportdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportdetails` (
  `detailId` int NOT NULL AUTO_INCREMENT,
  `detailReportId` int NOT NULL,
  `detailName` varchar(45) NOT NULL,
  `detailTypes` varchar(200) NOT NULL,
  PRIMARY KEY (`detailId`),
  KEY `reportDetails_fk_idx` (`detailReportId`),
  CONSTRAINT `reportDetails_fk` FOREIGN KEY (`detailReportId`) REFERENCES `reports` (`reportId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `reportId` int NOT NULL AUTO_INCREMENT,
  `reportName` varchar(45) NOT NULL,
  `reportActive` enum('YES','NO') NOT NULL,
  PRIMARY KEY (`reportId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transactionId` bigint NOT NULL AUTO_INCREMENT,
  `transactionAmount` decimal(18,3) NOT NULL,
  `transactionNarrative` varchar(200) DEFAULT NULL,
  `transactionPostingDate` date NOT NULL,
  `transactionCRDR` enum('Credit','Debit') NOT NULL,
  `transactionAccount` int NOT NULL,
  `transactionTypeId` int DEFAULT NULL,
  `transactionRelatedTransactionId` bigint DEFAULT NULL,
  `transactionModule` varchar(3) DEFAULT NULL,
  `transactionModuleId` bigint DEFAULT NULL,
  `transactionValueDate` date NOT NULL,
  PRIMARY KEY (`transactionId`),
  KEY `transactionAccount_fk_idx` (`transactionAccount`),
  KEY `transactionType_fk_idx` (`transactionTypeId`),
  KEY `transactionRelatedTransactionfk_idx` (`transactionRelatedTransactionId`),
  CONSTRAINT `transactionAccountfk` FOREIGN KEY (`transactionAccount`) REFERENCES `accounts` (`accountId`),
  CONSTRAINT `transactionRelatedTransactionfk` FOREIGN KEY (`transactionRelatedTransactionId`) REFERENCES `relatedtransactions` (`relatedTransactionsId`),
  CONSTRAINT `transactiontypefk` FOREIGN KEY (`transactionTypeId`) REFERENCES `transactiontypes` (`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactiontypes` (
  `typeId` int NOT NULL AUTO_INCREMENT,
  `typeName` varchar(45) NOT NULL,
  `typeCRDR` enum('Credit','Debit') NOT NULL,
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(20) NOT NULL,
  `userPassword` varchar(64) NOT NULL,
  `userActive` bit(1) NOT NULL,
  `userAttempt` int NOT NULL,
  `userToken` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','47729eaf9053e25ab469e4c2bf8961147e2939dc6f789bacdfda81d5df44d5e6',_binary '',0,NULL);
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

-- Dump completed on 2024-08-17 19:35:22
