<?php
require_once PROJECT_ROOT_PATH . "/Model/Database.php";
class UserModel extends Database
{
    public function getRatings()
    {
        return $this->select("SELECT * FROM ratings ORDER BY id ASC");
    }

    public function checkUserExists($username)
    {
        $result = $this->select("SELECT * FROM users WHERE username = ?", ["s", $username]);
        return count($result) != 0;
    }

    public function createUser($username, $password)
    {
        return $this->insert("INSERT INTO users (username, password) VALUES (?, ?)", ["ss", $username, $password]);
    }

    public function getUsersHashedPwd($username)
    {
        $rows = $this->select("SELECT password FROM users WHERE username = ?", ["s", $username]);
        return (count($rows) == 0 ? "" : $rows[0]['password']);
    }

    public function getSingleRating($id)
    {
        return $this->select("SELECT username, artist, song, rating FROM ratings WHERE id = ?", ["i", $id]);
    }

    public function checkIdExists($id)
    {
        $result = $this->select("SELECT username, artist, song, rating FROM ratings WHERE id = ?", ["i", $id]);
        // Returns true if id found in database
        return (count($result) == 0);
    }

    public function deleteRating($id)
    {
        return $this->delete("DELETE FROM ratings WHERE id = ?", ["i", $id]);
    }

    public function addRating($username, $artist, $song, $rating) {
        return $this->delete("INSERT INTO ratings (username, artist, song, rating) VALUES (?, ?, ?, ?)", ["sssi", $username, $artist, $song, $rating]);
    }

    public function checkUserAlreadyRated($username, $artist, $song) {
        $result = $this->select("SELECT username, artist, song FROM ratings WHERE username = ? AND artist = ? AND song = ?", ["sss", $username, $artist, $song]);
        // Returns true if user hasn't already rated
        return (count($result) == 0);
    }

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

    public function updateRating($artist, $song, $rating, $id) {
        return $this->insert("UPDATE ratings SET artist = ?, song = ?, rating = ? WHERE id = ?", ["sssi", $artist, $song, $rating, $id]);
    }

    public function checkUserAllowedToUpdate($username, $id) {
        $result = $this->select("SELECT username FROM ratings WHERE id = ?", ["i", $id]);
        // Returns true if username given matches username for given rating id
        return ($result[0]["username"] == $username);
    }

}
?>
