-- ==========================================
-- SAFE DROP SEQUENCE
-- ==========================================
DROP TABLE IF EXISTS OXEXE;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Works_ON;
DROP TABLE IF EXISTS OSE;
DROP TABLE IF EXISTS Projects;
DROP TABLE IF EXISTS BO;
DROP TABLE IF EXISTS Resource_Planner;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Type_of_contract;
GO  -- Executes the drops immediately

-- ==========================================
-- CREATE TABLES
-- ==========================================
CREATE TABLE Department(
    D_ID INT PRIMARY KEY,
    D_Name VARCHAR(50),
    Availability INT
);

CREATE TABLE Type_of_contract(
    C_ID INT PRIMARY KEY,
    C_Name VARCHAR(50)
);

CREATE TABLE Employees (
    ID INT PRIMARY KEY,
    FN VARCHAR(50),
    LN VARCHAR(50),
    Title VARCHAR(100),
    DOB DATE,
    Hired_Date DATE,
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Vendor_Name VARCHAR(20),
    Years_OF_Experience INT,
    Is_OSE BIT,    
    OSE_ID INT,    
    Manager_ID INT,
    D_ID INT,
    Type_of_contract_ID INT,
    FOREIGN KEY (Manager_ID) REFERENCES Employees(ID),
    FOREIGN KEY (D_ID) REFERENCES Department(D_ID),
    FOREIGN KEY (Type_of_contract_ID) REFERENCES Type_of_contract(C_ID)
);

CREATE TABLE Users (
    User_ID INT IDENTITY(1,1) PRIMARY KEY,
    Employee_ID INT NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50) NOT NULL,

    FOREIGN KEY (Employee_ID) REFERENCES Employees(ID)
);

CREATE TABLE BO (
    BO_ID INT PRIMARY KEY,
    Name VARCHAR(100),
    Business_Area VARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20)
);

CREATE TABLE Projects (
    Prj_ID INT PRIMARY KEY,
    Project_Name VARCHAR(150),
    Flag VARCHAR(50),
    Status VARCHAR(50),
    Description VARCHAR(500),
    Budget DECIMAL(15, 2),
    MVP VARCHAR(100),
    BRD VARCHAR(100),
    Start_date DATE,
    End_date DATE,
    BO_ID INT,
    FOREIGN KEY (BO_ID) REFERENCES BO(BO_ID)
);

CREATE TABLE Works_ON (
    Employee_ID INT,
    Prj_ID INT,
    PRIMARY KEY (Employee_ID, Prj_ID),
    FOREIGN KEY (Employee_ID) REFERENCES Employees(ID),
    FOREIGN KEY (Prj_ID) REFERENCES Projects(Prj_ID)
);

CREATE TABLE Resource_Planner (
    Planner_ID INT PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20)
);

CREATE TABLE OSE (
    OSE_ID INT PRIMARY KEY,
    FN VARCHAR(50),
    LN VARCHAR(50),
    Vendor VARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Status VARCHAR(50),
    Planner_ID INT,
    Interviewer_ID INT,
    FOREIGN KEY (Planner_ID) REFERENCES Resource_Planner(Planner_ID),
    FOREIGN KEY (Interviewer_ID) REFERENCES Employees(ID)
);

CREATE TABLE OXEXE (
    OSE_ID INT,
    EMP_ID INT,
    FOREIGN KEY (OSE_ID) REFERENCES OSE(OSE_ID),
    FOREIGN KEY (EMP_ID) REFERENCES Employees(ID),
    PRIMARY KEY (OSE_ID, EMP_ID)
);
GO  -- Forces the new schema to compile before parsing the INSERTs below

-- ==========================================
-- POPULATE TABLES
-- ==========================================
INSERT INTO Department (D_ID, D_Name, Availability) VALUES
(1, 'Tester', 2),
(2, 'Product Owner', 2),
(3, 'Scrum Master', 3),
(4, 'Backend', 1),
(5, 'UI/UX Design', 2),
(6, 'Frontend', 1);

INSERT INTO Type_of_contract (C_ID, C_Name) VALUES
(1, 'Full-Time Permanent'),
(2, 'Part-Time Permanent'),
(3, 'Outsource');

INSERT INTO Employees (ID, FN, LN, Title, DOB, Hired_Date, Email, Phone, Vendor_Name, Years_OF_Experience, Is_OSE, OSE_ID, Manager_ID, D_ID, Type_of_contract_ID) VALUES
-- Managers 
(1,  'John',     'Carter',    'Head of Backend',       '1980-03-12', '2014-01-15', 'john.carter@company.com',    '555-0101', NULL, 15, 0, NULL, NULL, 4, 1),
(2,  'Sarah',    'Lee',       'Head of Tester',         '1982-07-25', '2015-03-01', 'sarah.lee@company.com',      '555-0102', NULL, 13, 0, NULL, NULL, 1, 1),
(3,  'Michael',  'Chen',      'Head of Product Owner',  '1979-11-02', '2013-06-10', 'michael.chen@company.com',   '555-0103', NULL, 16, 0, NULL, NULL, 2, 1),
(4,  'Emma',     'Davis',     'Head of Scrum Master',   '1985-05-19', '2016-09-01', 'emma.davis@company.com',     '555-0104', NULL, 11, 0, NULL, NULL, 3, 1),
(5,  'Olivia',   'Brown',     'Head of UI/UX Design',   '1983-02-08', '2015-11-20', 'olivia.brown@company.com',   '555-0105', NULL, 12, 0, NULL, NULL, 5, 1),
(6,  'Liam',     'Wilson',    'Head of Frontend',       '1981-09-30', '2014-04-05', 'liam.wilson@company.com',    '555-0106', NULL, 14, 0, NULL, NULL, 6, 1),
(16, 'Omar',     'Khatab',    'Head of DF',             '1983-09-30', '2014-07-05', 'omar@company.com',           '555-2106', NULL, 14, 0, NULL, NULL, 1, 1),
-- Regular employees
(7,  'Noah',     'Martinez',  'Employee', '1992-01-14', '2019-02-11', 'noah.martinez@company.com',  '555-0107', NULL,             6, 0, NULL, 1, 4, 2),
(8,  'Ava',      'Thompson',  'Employee', '1994-06-21', '2020-07-19', 'ava.thompson@company.com',   '555-0108', 'TechStaff Inc.', 4, 1, 1,    1, 4, 3), 
(9,  'Sophia',   'Anderson',  'Employee', '1991-03-03', '2018-05-14', 'sophia.anderson@company.com','555-0109', NULL,             7, 0, NULL, 2, 1, 1),
(10, 'James',    'Taylor',    'Employee', '1993-08-27', '2019-10-02', 'james.taylor@company.com',   '555-0110', NULL,             5, 0, NULL, 2, 1, 2),
(11, 'Isabella', 'Moore',     'Employee', '1990-12-11', '2017-08-23', 'isabella.moore@company.com', '555-0111', NULL,             8, 0, NULL, 3, 2, 1),
(12, 'Benjamin', 'White',     'Employee', '1995-04-16', '2021-01-11', 'benjamin.white@company.com', '555-0112', 'GlobalTech Sol.',3, 1, 2,    4, 3, 3), 
(13, 'Mia',      'Harris',    'Employee', '1993-10-05', '2020-03-09', 'mia.harris@company.com',     '555-0113', NULL,             5, 0, NULL, 5, 5, 1),
(14, 'Ethan',    'Clark',     'Employee', '1996-02-28', '2022-06-06', 'ethan.clark@company.com',    '555-0114', NULL,             2, 0, NULL, 6, 6, 2),
(15, 'Charlotte','Lewis',     'Employee', '1994-09-09', '2021-09-15', 'charlotte.lewis@company.com','555-0115', NULL,             4, 0, NULL, 6, 6, 1);

INSERT INTO BO (BO_ID, Name, Business_Area, Email, Phone) VALUES
(1, 'Robert King',  'Finance',     'robert.king@company.com',  '555-0201'),
(2, 'Linda Scott',  'Marketing',   'linda.scott@company.com',  '555-0202'),
(3, 'David Green',  'Operations',  'david.green@company.com',  '555-0203');

INSERT INTO Projects (Prj_ID, Project_Name, Flag, Status, Description, Budget, MVP, BRD, Start_date, End_date, BO_ID) VALUES
(1, 'Online Banking Revamp',       'High Priority', 'In Progress', 'Redesign and modernize the online banking platform.',        250000.00, 'Approved', 'BRD_OnlineBanking_v1.pdf',  '2025-01-10', '2025-12-15', 1),
(2, 'Marketing Campaign Tool',     'Medium',        'Planning',    'Internal tool to plan and track marketing campaigns.',        80000.00,  'Draft',    'BRD_MarketingTool_v1.pdf', '2026-02-01', '2026-08-30', 2),
(3, 'Inventory Management System', 'High Priority', 'In Progress', 'System to track and manage warehouse inventory in real time.', 150000.00, 'Approved', 'BRD_Inventory_v2.pdf',     '2025-06-01', '2026-05-01', 3),
(4, 'Customer Portal',             'Low',           'Completed',   'Self-service portal for customer account management.',        120000.00, 'Approved', 'BRD_CustomerPortal_v1.pdf','2024-03-01', '2025-01-20', 1);

INSERT INTO Works_ON (Employee_ID, Prj_ID) VALUES
(1, 1), (7, 1), (8, 1),
(6, 2), (14, 2), (15, 2),
(3, 3), (11, 3),
(2, 3), (9, 3), (10, 3),
(5, 4), (13, 4),
(4, 1), (4, 2);

INSERT INTO Resource_Planner (Planner_ID, Name, Email, Phone) VALUES
(1, 'Karen Adams', 'karen.adams@company.com', '555-0301'),
(2, 'Peter Nguyen', 'peter.nguyen@company.com', '555-0302');

INSERT INTO OSE (OSE_ID, FN, LN, Vendor, Email, Phone, Status, Planner_ID, Interviewer_ID) VALUES
(1, 'Daniel',  'Foster',  'TechStaff Inc.',    'daniel.foster@vendor.com',  '555-0401', 'Active',   1, 1),
(2, 'Grace',   'Bennett', 'GlobalTech Sol.',   'grace.bennett@vendor.com',  '555-0402', 'Active',   1, 2),
(3, 'Victor',  'Ramos',   'PrimeConsulting',   'victor.ramos@vendor.com',   '555-0403', 'Interview',2, 6);

INSERT INTO OXEXE (OSE_ID, EMP_ID) VALUES
(1, 8), 
(2, 12);

INSERT INTO Users (Employee_ID, PasswordHash, Role)
VALUES
(1, 'TEMP_HASH', 'Manager'),
(7, 'TEMP_HASH', 'Employee'),
(16, 'TEMP_HASH', 'Admin');
