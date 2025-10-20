CREATE DATABASE IF NOT EXISTS bd_hotel;
USE bd_hotel;

-- Table hotels
CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255),
    ville VARCHAR(255),
    statut ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table utilisateurs
CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prenom VARCHAR(255),
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(50),
    role ENUM('super_admin', 'admin_hotel', 'reception', 'menage', 'client') NOT NULL,
    hotel_id INT,
    statut ENUM('actif', 'inactif') NOT NULL DEFAULT 'actif',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Table chambres
CREATE TABLE chambres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    numero_chambre VARCHAR(50) NOT NULL,
    type_chambre ENUM('standard', 'junior', 'executive', 'presidentielle') NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    statut ENUM('disponible', 'occupee', 'nettoyage', 'maintenance') NOT NULL,
    etage INT NOT NULL,
    surface INT,
    capacite INT,
    lit VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

-- Table reservations
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_reservation VARCHAR(255) UNIQUE,
    hotel_id INT NOT NULL,
    chambre_id INT,
    type_chambre ENUM('standard', 'junior', 'executive', 'presidentielle') NOT NULL,
    utilisateur_id INT,
    date_arrivee DATETIME NOT NULL,
    date_depart DATETIME,
    type_reservation ENUM('horaire', 'classique') NOT NULL,
    duree_heures INT,
    informations_client JSON,
    statut_paiement ENUM('en_attente', 'paye_online', 'a_payer_sur_place') NOT NULL,
    methode_paiement ENUM('en_ligne', 'sur_place') NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_attente', 'confirmee', 'annulee', 'terminee', 'en_cours') NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (chambre_id) REFERENCES chambres(id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);