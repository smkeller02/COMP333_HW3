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

}
?>
