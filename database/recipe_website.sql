CREATE TABLE recipes (
      ID INT UNIQUE NOT NULL AUTO_INCREMENT,
      name VARCHAR(64) NOT NULL,
      about TEXT,
      ingredients TEXT NOT NULL,
      prepTime NOT NOT NULL,
      cookTime INT NOT NULL,
      servings INT NOT NULL,
      instructions TEXT NOT NULL,
      ownerID INT NOT NULL DEFAULT 1,
      dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
      imageURL VARCHAR(500),
      PRIMARY KEY (name, ownerID),
      FOREIGN KEY (ownerID) REFERENCES users (ID)
);