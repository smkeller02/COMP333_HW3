<?php
// SYDNEY KELLER + MINJI WOO 
// smkeller@wesleyan.edu, mjwoo@wesleyan.edu

session_start();

require_once PROJECT_ROOT_PATH . "/Model/Database.php";
class UserModel extends Database
{
    // Get all ratings table data
    public function getRatings()
    {
        return $this->select("SELECT * FROM ratings ORDER BY id ASC");
    }

    // Given a username, check if the username is in database. If it is, return true, else return false
    public function checkUserExists($username)
    {
        $result = $this->select("SELECT * FROM users WHERE username = ?", ["s", $username]);
        return count($result) != 0;
    }

    // Insert given username and password into users database
    public function createUser($username, $password)
    {
        return $this->insert("INSERT INTO users (username, password) VALUES (?, ?)", ["ss", $username, $password]);
    }

    // Given a username, return the hashed password in users datatable. If there is a matching password associated with username, return hashed password, if not return ""
    public function getUsersHashedPwd($username)
    {
        $rows = $this->select("SELECT password FROM users WHERE username = ?", ["s", $username]);
        return (count($rows) == 0 ? "" : $rows[0]['password']);
    }

    // Given an id, return the assocciated data
    public function getSingleRating($id)
    {
        return $this->select("SELECT username, artist, song, rating FROM ratings WHERE id = ?", ["i", $id]);
    }

    // Given id, check if there is any data associated with it. Return true if id found in database
    public function checkIdExists($id)
    {
        $result = $this->select("SELECT username, artist, song, rating FROM ratings WHERE id = ?", ["i", $id]);
        // Returns true if id found in database
        return (count($result) == 0);
    }

    // Given id, delete the associated data
    public function deleteRating($id)
    {
        return $this->delete("DELETE FROM ratings WHERE id = ?", ["i", $id]);
    }

    // Given username, artist, song, rating, insert into database
    public function addRating($username, $artist, $song, $rating) {
        //Note: this-> delete has general functionality of doing something to database and that is why it is being used
        // rather than creating a redundant func
        return $this->delete("INSERT INTO ratings (username, artist, song, rating) VALUES (?, ?, ?, ?)", ["sssi", $username, $artist, $song, $rating]);
    }

    // Given username, artist, song, check if there is a match in the database and if there is (aka user already rated the song) return false
    public function checkUserAlreadyRated($username, $artist, $song) {
        $result = $this->select("SELECT username, artist, song FROM ratings WHERE username = ? AND artist = ? AND song = ?", ["sss", $username, $artist, $song]);
        // Returns true if user hasn't already rated
        return (count($result) == 0);
    }

    // Given username, artist, song, return true if user hasn't already rated that combination of artist and song
    public function checkPreviouslyRated($id, $username, $artist, $song) { // Different than above func. For update feature
        $result = $this->select("SELECT id FROM ratings WHERE username = ? AND artist = ? AND song = ?", ["sss", $username, $artist, $song]);
        // Returns true if user hasn't already rated, false otherise
        for ($i = 0; $i < count($result); $i++) {
            if ($result[$i]["id"] != $id) {
                return false;
            }
        }
        return true;
    }

    // Given an id and new data, update the data assocciated with id in database to be new data
    public function updateRating($artist, $song, $rating, $id) {
        return $this->insert("UPDATE ratings SET artist = ?, song = ?, rating = ? WHERE id = ?", ["sssi", $artist, $song, $rating, $id]);
    }

    // Given a username and id, returns true if username given matches username for given rating id
    public function checkUserAllowedToUpdate($username, $id) {
        $result = $this->select("SELECT username FROM ratings WHERE id = ?", ["i", $id]);
        // Returns true if username given matches username for given rating id
        return ($result[0]["username"] == $username);
    }

}
?>
