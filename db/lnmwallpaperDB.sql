-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 05, 2020 at 12:32 PM
-- Server version: 10.2.36-MariaDB
-- PHP Version: 7.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lnmwallpaperDB`
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
(1, 'admin@gmail.com', '0e7517141fb53f21ee439b355b5a1d0a'),
(2, 'davidmookmhs@gmail.com', 'b78d3dba718cfa46f79ce02120ed57fb');

-- --------------------------------------------------------

--
-- Table structure for table `AreaTbl`
--

CREATE TABLE `AreaTbl` (
  `AreaId` int(11) NOT NULL,
  `AreaName` varchar(100) NOT NULL,
  `IsActive` int(11) NOT NULL COMMENT '0-Show, 1-Hidden'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `AreaTbl`
--

INSERT INTO `AreaTbl` (`AreaId`, `AreaName`, `IsActive`) VALUES
(1, 'Surat', 0);

-- --------------------------------------------------------

--
-- Table structure for table `CategoryTbl`
--

CREATE TABLE `CategoryTbl` (
  `CategoryId` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL,
  `Img` text NOT NULL COMMENT 'Path of Category Image',
  `IsActive` int(11) NOT NULL COMMENT '0-Show, 1-Hidden'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ComplaintTbl`
--

CREATE TABLE `ComplaintTbl` (
  `ComplaintId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ComplaintImg` text NOT NULL,
  `Remarks` text DEFAULT NULL,
  `ComplaintStatus` int(11) DEFAULT NULL COMMENT '0-Pending, 1-In Progress, 2-Completed',
  `AssignedTo` int(11) NOT NULL COMMENT 'Reference to the installer Id',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `GalleryTbl`
--

CREATE TABLE `GalleryTbl` (
  `GalleryId` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `GalleryImg` text NOT NULL COMMENT 'This is the image after installation',
  `Hidden` tinyint(1) NOT NULL DEFAULT 1 COMMENT '0-Hidden, 1-Show',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Table for Gallery and Installation Image';

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
  `Remarks` varchar(50) NOT NULL,
  `IsAttended` int(11) NOT NULL DEFAULT 0 COMMENT '0- Not Attended, 1- Attended'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `JobTbl`
--

CREATE TABLE `JobTbl` (
  `JobId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `JobStatus` int(11) NOT NULL DEFAULT 0 COMMENT '0-Pending,1-In Progeress,2-Completed',
  `AssignedTo` int(11) NOT NULL DEFAULT 0 COMMENT 'Reference to Installer Id',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `OfferTbl`
--

CREATE TABLE `OfferTbl` (
  `OfferId` int(11) NOT NULL,
  `OfferName` varchar(150) NOT NULL COMMENT 'EG.: 10% off in this month',
  `IsActive` int(11) NOT NULL COMMENT '0-Show, 1-Hidden'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `OfferTbl`
--

INSERT INTO `OfferTbl` (`OfferId`, `OfferName`, `IsActive`) VALUES
(1, '10% off', 0);

-- --------------------------------------------------------

--
-- Table structure for table `OrderDetailsTbl`
--

CREATE TABLE `OrderDetailsTbl` (
  `OrderDetailsId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `OrderTbl`
--

CREATE TABLE `OrderTbl` (
  `OrderId` int(11) NOT NULL,
  `CustomerId` int(11) NOT NULL,
  `ServiceId` int(11) NOT NULL,
  `TypeId` int(11) NOT NULL,
  `NODWarranty` int(11) NOT NULL,
  `WallDimension` varchar(255) NOT NULL DEFAULT '0',
  `WarrantyExpired` int(11) NOT NULL DEFAULT 0 COMMENT '0-No, 1-Yes',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedAt` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ProductTbl`
--

CREATE TABLE `ProductTbl` (
  `ProductId` int(11) NOT NULL,
  `CategoryId` int(11) NOT NULL COMMENT 'Reference to category',
  `ProductTitle` varchar(50) NOT NULL,
  `Price` varchar(50) DEFAULT NULL,
  `Details` text DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0-Show, 1-Hidden',
  `ProductImg` text NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(1, 'High Wall(>= 11 ft)'),
(2, 'Normal Wall(< = 10 ft)'),
(3, 'Ceiling'),
(4, 'Skin Coat'),
(5, 'Removing Wallpaper'),
(6, 'Install Sticker'),
(7, 'Install Roller Blinds'),
(8, 'Install Mural Wallpaper'),
(9, 'Other');

-- --------------------------------------------------------

--
-- Table structure for table `UserTbl`
--

CREATE TABLE `UserTbl` (
  `UserId` int(11) NOT NULL,
  `UserName` varchar(50) DEFAULT NULL,
  `Email` text NOT NULL,
  `ContactNo` varchar(50) NOT NULL,
  `Address` text NOT NULL,
  `Password` text NOT NULL,
  `AreaId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL COMMENT '1-Customer, 2- Installer',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(1, '21\" Wallpaper'),
(2, 'Korean Wallpaper'),
(3, 'Mural Wallpaper'),
(4, 'Touch Up Service'),
(5, '3M Sticker'),
(6, 'Canvas'),
(7, 'Roller Blinds');

-- --------------------------------------------------------

--
-- Table structure for table `WarrantyTbl`
--

CREATE TABLE `WarrantyTbl` (
  `WarrantyId` int(11) NOT NULL,
  `WarrantyName` varchar(50) NOT NULL,
  `WarrantyValue` int(11) NOT NULL COMMENT 'Warrany value in days.',
  `IsActive` int(11) NOT NULL COMMENT '0-Show, 1-Hidden'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  MODIFY `AdminId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `AreaTbl`
--
ALTER TABLE `AreaTbl`
  MODIFY `AreaId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `CategoryTbl`
--
ALTER TABLE `CategoryTbl`
  MODIFY `CategoryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ComplaintTbl`
--
ALTER TABLE `ComplaintTbl`
  MODIFY `ComplaintId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `GalleryTbl`
--
ALTER TABLE `GalleryTbl`
  MODIFY `GalleryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `InquiryTbl`
--
ALTER TABLE `InquiryTbl`
  MODIFY `InquiryId` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `ProductId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `RoleTbl`
--
ALTER TABLE `RoleTbl`
  MODIFY `RoleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ServiceTbl`
--
ALTER TABLE `ServiceTbl`
  MODIFY `ServiceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `UserTbl`
--
ALTER TABLE `UserTbl`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `WallpaperTypeTbl`
--
ALTER TABLE `WallpaperTypeTbl`
  MODIFY `TypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `WarrantyTbl`
--
ALTER TABLE `WarrantyTbl`
  MODIFY `WarrantyId` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
