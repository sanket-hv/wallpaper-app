-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2020 at 09:47 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wallpaperDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `AdminTbl`
--

CREATE TABLE `AdminTbl` (
  `AdminId` int(11) NOT NULL,
  `Email` text NOT NULL,
  `Password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `AdminTbl`
--

INSERT INTO `AdminTbl` (`AdminId`, `Email`, `Password`) VALUES
(1, 'admin@gmail.com', '21232f297a57a5a743894a0e4a801fc3'),
(3, 'abc@gmail.com', '0e7517141fb53f21ee439b355b5a1d0a');

-- --------------------------------------------------------

--
-- Table structure for table `AreaTbl`
--

CREATE TABLE `AreaTbl` (
  `AreaId` int(11) NOT NULL,
  `AreaName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `AreaTbl`
--

INSERT INTO `AreaTbl` (`AreaId`, `AreaName`) VALUES
(1, 'Yogichowk1'),
(2, 'Simada'),
(3, 'Varachha');

-- --------------------------------------------------------

--
-- Table structure for table `CategoryTbl`
--

CREATE TABLE `CategoryTbl` (
  `CategoryId` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL,
  `Img` text NOT NULL COMMENT 'Path of Category Image'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `CategoryTbl`
--

INSERT INTO `CategoryTbl` (`CategoryId`, `CategoryName`, `Img`) VALUES
(14, 'Category 1', '1592984975385Annotation 2020-06-20 085744.png'),
(15, 'dgdfgd', 'rhdghgh'),
(16, 'ghh', 'dvbhdfghdfgh');

-- --------------------------------------------------------

--
-- Table structure for table `ComplaintTbl`
--

CREATE TABLE `ComplaintTbl` (
  `ComplaintId` int(11) NOT NULL,
  `CustomerId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ComplaintImg` text NOT NULL,
  `Remarks` text,
  `ComplaintStatus` int(11) DEFAULT '0' COMMENT '0-Pending, 1-In Progress, 2-Completed',
  `AssignedTo` int(11) NOT NULL DEFAULT '0' COMMENT 'Reference to the installer Id',
  `CreatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `GalleryTbl`
--

CREATE TABLE `GalleryTbl` (
  `GalleryId` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `GalleryImg` text NOT NULL COMMENT 'This is the image after installation',
  `Hidden` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0-Hidden, 1-Show',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Table for Gallery and Installation Image';

--
-- Dumping data for table `GalleryTbl`
--

INSERT INTO `GalleryTbl` (`GalleryId`, `JobId`, `GalleryImg`, `Hidden`, `CreatedAt`) VALUES
(1, 1, 'nngfnn', 0, '2020-06-27 12:51:26'),
(2, 1, 'gdfgdghfdh', 1, '2020-06-27 13:00:23'),
(3, 2, 'gdhfghh', 1, '2020-06-27 13:00:34');

-- --------------------------------------------------------

--
-- Table structure for table `InquiryTbl`
--

CREATE TABLE `InquiryTbl` (
  `InquiryId` int(11) NOT NULL,
  `InquiryDate` date NOT NULL,
  `Name` varchar(50) NOT NULL,
  `ContactNo` text NOT NULL,
  `EmailId` text NOT NULL,
  `IsAttended` int(11) NOT NULL DEFAULT '0' COMMENT '0- Not Attended, 1- Attended'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `InquiryTbl`
--

INSERT INTO `InquiryTbl` (`InquiryId`, `InquiryDate`, `Name`, `ContactNo`, `EmailId`, `IsAttended`) VALUES
(1, '2020-06-27', 'Sanket', '8347583112', 'sanket@gmail.com', 0),
(2, '2020-06-24', 'ghjghjkg', 'gyjtyiu', 'jhgkghiyui', 1);

-- --------------------------------------------------------

--
-- Table structure for table `JobTbl`
--

CREATE TABLE `JobTbl` (
  `JobId` int(11) NOT NULL,
  `CustomerId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `JobStatus` int(11) NOT NULL DEFAULT '0' COMMENT '0-Pending,1-In Progeress,2-Completed',
  `AssignedTo` int(11) NOT NULL DEFAULT '0' COMMENT 'Reference to Installer Id',
  `CreatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `OfferTbl`
--

CREATE TABLE `OfferTbl` (
  `OfferId` int(11) NOT NULL,
  `OfferName` varchar(150) NOT NULL COMMENT 'EG.: 10% off in this month'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `OfferTbl`
--

INSERT INTO `OfferTbl` (`OfferId`, `OfferName`) VALUES
(1, '10% Off  1211');

-- --------------------------------------------------------

--
-- Table structure for table `OrderDetailsTbl`
--

CREATE TABLE `OrderDetailsTbl` (
  `OrderDetailsId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Price` int(11) DEFAULT '0',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `OrderTbl`
--

CREATE TABLE `OrderTbl` (
  `OrderId` int(11) NOT NULL,
  `CustomerId` int(11) NOT NULL,
  `NODWarranty` int(11) NOT NULL,
  `WarrantyExpired` int(11) NOT NULL DEFAULT '0' COMMENT '0-No, 1-Yes',
  `CreatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ProductTbl`
--

CREATE TABLE `ProductTbl` (
  `ProductId` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL COMMENT 'Reference to category',
  `ServiceId` int(11) NOT NULL,
  `TypeId` int(11) NOT NULL,
  `ProductTitle` varchar(50) NOT NULL,
  `Price` int(11) DEFAULT NULL,
  `Details` text,
  `IsActive` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0-Show, 1-Hidden',
  `ProductImg` text NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ProductTbl`
--

INSERT INTO `ProductTbl` (`ProductId`, `CategoryId`, `ServiceId`, `TypeId`, `ProductTitle`, `Price`, `Details`, `IsActive`, `ProductImg`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 14, 2, 1, 'Product 1', 1000, 'sdfgdfg', 0, '1593164881795availability.png', '2020-06-26 09:48:01', '2020-06-26 09:48:01');

-- --------------------------------------------------------

--
-- Table structure for table `RoleTbl`
--

CREATE TABLE `RoleTbl` (
  `RoleId` int(11) NOT NULL,
  `RoleName` varchar(50) NOT NULL COMMENT '1- Customer, 2-Installer'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `RoleTbl`
--

INSERT INTO `RoleTbl` (`RoleId`, `RoleName`) VALUES
(1, 'Customer'),
(2, 'Installer');

-- --------------------------------------------------------

--
-- Table structure for table `ServiceTbl`
--

CREATE TABLE `ServiceTbl` (
  `ServiceId` int(11) NOT NULL,
  `ServiceName` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ServiceTbl`
--

INSERT INTO `ServiceTbl` (`ServiceId`, `ServiceName`) VALUES
(1, 'Service 1'),
(2, 'Service 2');

-- --------------------------------------------------------

--
-- Table structure for table `UserTbl`
--

CREATE TABLE `UserTbl` (
  `UserId` int(11) NOT NULL,
  `UserName` varchar(50) DEFAULT NULL,
  `Email` text NOT NULL,
  `ContactNo` varchar(50) NOT NULL,
  `Password` text NOT NULL,
  `AreaId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL COMMENT '1-Customer, 2- Installer',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `UserTbl`
--

INSERT INTO `UserTbl` (`UserId`, `UserName`, `Email`, `ContactNo`, `Password`, `AreaId`, `RoleId`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'sanket', 'sanket@gmail.com', '8347583112', 'e10adc3949ba59abbe56e057f20f883e', 1, 1, '2020-06-28 04:22:42', '2020-06-25 16:46:11'),
(2, 'abc', 'abc@gmail.com', '', '202cb962ac59075b964b07152d234b70', 2, 2, '0000-00-00 00:00:00', '2020-06-25 16:47:35'),
(3, 'hjklhj', 'vbjh@fh.cgh', '', 'fed52c2b426f9352b5e8940d2c84802c', 1, 2, '0000-00-00 00:00:00', '2020-06-25 17:03:00'),
(4, 'gjj', 'jkkljj@fhj.hg', '', '21b4606947988633e73a62a7bcf811fd', 3, 1, '0000-00-00 00:00:00', '2020-06-25 17:03:34'),
(5, 'fghffghf', 'hgfhg@fghfgn.vhg', '', '7c8340bb70aaa501159d6ef65c4aa14e', 1, 1, '0000-00-00 00:00:00', '2020-06-25 17:05:07'),
(6, 'gh', 'bb@cghchg.vg', '25725752154', 'hjklh', 1, 2, '2020-06-28 04:23:12', '2020-06-25 17:07:29'),
(7, 'fngg', 'vmn@fhg.fhgf', '', 'd2b0214c9aced3b346343a19767252cd', 2, 2, '0000-00-00 00:00:00', '2020-06-25 17:08:52'),
(8, 'fjhfjh', 'jhkl@ghjgj.gjhg', '424274275275', '09baaae58f88180a368877c43e66c730', 2, 1, '2020-06-28 04:22:54', '2020-06-25 17:10:10'),
(9, 'dtydyr', 'rtghf@gh.tdygf', '', 'a51abd674cb4b2ea2bd3adcb0dd30319', 3, 1, '0000-00-00 00:00:00', '2020-06-25 17:15:30'),
(10, 'gxvcxg', 'gchbgfh', '', 'fghfgh', 1, 2, '2020-06-15 20:54:20', '2020-06-25 17:16:20'),
(11, 'customer', 'customer@gmail.com', '', '91ec1f9324753048c0096d036a694f86', 2, 2, '0000-00-00 00:00:00', '2020-06-25 17:24:21'),
(12, 'fjh', 'cghgf@ghjghj.hdtyhf', '', 'd9d919051c8d5afa3e51605c269a6d47', 1, 2, '0000-00-00 00:00:00', '2020-06-25 17:25:22'),
(13, 'installer1', 'installer@gmail.com', '', '97384261b8bbf966df16e5ad509922db', 2, 2, '2020-06-26 05:16:05', '2020-06-26 05:16:05'),
(14, 'customer1', 'customer1@gmail.com', '8780015120', '6c9a14ff289856473d4c56f3dbd905a9', 2, 1, '2020-06-28 04:31:50', '2020-06-28 04:31:50'),
(15, 'asdaf', 'aaa@gadg.sdfg', '78666877687', '040b7cf4a55014e185813e0644502ea9', 2, 1, '2020-06-28 04:33:13', '2020-06-28 04:33:13'),
(16, 'zjjjjjjjhm', 'zfhjf@ddv.jyfutfgj', '5445243', '509b0fe6beeb94456c02bc76ef1d76d6', 1, 1, '2020-06-28 04:33:55', '2020-06-28 04:33:55'),
(17, 'zfadfgsd', 'zada@dsgsd.fdasf', '24555', 'a05f127e872e6a18f371fbe24c020ee7', 1, 2, '2020-06-28 04:42:17', '2020-06-28 04:42:17');

-- --------------------------------------------------------

--
-- Table structure for table `WallpaperTypeTbl`
--

CREATE TABLE `WallpaperTypeTbl` (
  `TypeId` int(11) NOT NULL,
  `TypeName` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `WallpaperTypeTbl`
--

INSERT INTO `WallpaperTypeTbl` (`TypeId`, `TypeName`) VALUES
(1, 'Type 1'),
(2, 'Type 2');

-- --------------------------------------------------------

--
-- Table structure for table `WarrantyTbl`
--

CREATE TABLE `WarrantyTbl` (
  `WarrantyId` int(11) NOT NULL,
  `WarrantyName` varchar(50) NOT NULL,
  `WarrantyValue` int(11) NOT NULL COMMENT 'Warrany value in days.'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `WarrantyTbl`
--

INSERT INTO `WarrantyTbl` (`WarrantyId`, `WarrantyName`, `WarrantyValue`) VALUES
(1, '1 Month', 32),
(2, '6 Month', 182);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AdminTbl`
--
ALTER TABLE `AdminTbl`
  ADD PRIMARY KEY (`AdminId`);

--
-- Indexes for table `AreaTbl`
--
ALTER TABLE `AreaTbl`
  ADD PRIMARY KEY (`AreaId`);

--
-- Indexes for table `CategoryTbl`
--
ALTER TABLE `CategoryTbl`
  ADD PRIMARY KEY (`CategoryId`);

--
-- Indexes for table `ComplaintTbl`
--
ALTER TABLE `ComplaintTbl`
  ADD PRIMARY KEY (`ComplaintId`);

--
-- Indexes for table `GalleryTbl`
--
ALTER TABLE `GalleryTbl`
  ADD PRIMARY KEY (`GalleryId`);

--
-- Indexes for table `InquiryTbl`
--
ALTER TABLE `InquiryTbl`
  ADD PRIMARY KEY (`InquiryId`);

--
-- Indexes for table `JobTbl`
--
ALTER TABLE `JobTbl`
  ADD PRIMARY KEY (`JobId`);

--
-- Indexes for table `OfferTbl`
--
ALTER TABLE `OfferTbl`
  ADD PRIMARY KEY (`OfferId`);

--
-- Indexes for table `OrderDetailsTbl`
--
ALTER TABLE `OrderDetailsTbl`
  ADD PRIMARY KEY (`OrderDetailsId`);

--
-- Indexes for table `OrderTbl`
--
ALTER TABLE `OrderTbl`
  ADD PRIMARY KEY (`OrderId`);

--
-- Indexes for table `ProductTbl`
--
ALTER TABLE `ProductTbl`
  ADD PRIMARY KEY (`ProductId`);

--
-- Indexes for table `RoleTbl`
--
ALTER TABLE `RoleTbl`
  ADD PRIMARY KEY (`RoleId`);

--
-- Indexes for table `ServiceTbl`
--
ALTER TABLE `ServiceTbl`
  ADD PRIMARY KEY (`ServiceId`);

--
-- Indexes for table `UserTbl`
--
ALTER TABLE `UserTbl`
  ADD PRIMARY KEY (`UserId`);

--
-- Indexes for table `WallpaperTypeTbl`
--
ALTER TABLE `WallpaperTypeTbl`
  ADD PRIMARY KEY (`TypeId`);

--
-- Indexes for table `WarrantyTbl`
--
ALTER TABLE `WarrantyTbl`
  ADD PRIMARY KEY (`WarrantyId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AdminTbl`
--
ALTER TABLE `AdminTbl`
  MODIFY `AdminId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `AreaTbl`
--
ALTER TABLE `AreaTbl`
  MODIFY `AreaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `CategoryTbl`
--
ALTER TABLE `CategoryTbl`
  MODIFY `CategoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `ComplaintTbl`
--
ALTER TABLE `ComplaintTbl`
  MODIFY `ComplaintId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `GalleryTbl`
--
ALTER TABLE `GalleryTbl`
  MODIFY `GalleryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `InquiryTbl`
--
ALTER TABLE `InquiryTbl`
  MODIFY `InquiryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `JobTbl`
--
ALTER TABLE `JobTbl`
  MODIFY `JobId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OfferTbl`
--
ALTER TABLE `OfferTbl`
  MODIFY `OfferId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `OrderDetailsTbl`
--
ALTER TABLE `OrderDetailsTbl`
  MODIFY `OrderDetailsId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OrderTbl`
--
ALTER TABLE `OrderTbl`
  MODIFY `OrderId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ProductTbl`
--
ALTER TABLE `ProductTbl`
  MODIFY `ProductId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `RoleTbl`
--
ALTER TABLE `RoleTbl`
  MODIFY `RoleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ServiceTbl`
--
ALTER TABLE `ServiceTbl`
  MODIFY `ServiceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `UserTbl`
--
ALTER TABLE `UserTbl`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `WallpaperTypeTbl`
--
ALTER TABLE `WallpaperTypeTbl`
  MODIFY `TypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `WarrantyTbl`
--
ALTER TABLE `WarrantyTbl`
  MODIFY `WarrantyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
