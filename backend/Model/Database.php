<?php
class Database
{
    function log($message) {
        $log_file = "/Applications/XAMPP/logs/HW3debugging-log.log";
        error_log($message . "\n", 3, $log_file);
    }

    protected $connection = null;
    public function __construct()
    {
        try {
            $this->connection = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME);

            if ( mysqli_connect_errno()) {
                throw new Exception("Could not connect to database.");
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
    public function select($query = "" , $params = [])
    {
        try {
            $stmt = $this->executeStatement( $query , $params );
            $stmtResult = $stmt->get_result();
            $result = $stmtResult->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            return $result;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
    }

    private function executeStatement($query = "" , $params = [])
    {
        try {
            $this->log("executeStatement");
            $stmt = $this->connection->prepare( $query );
            if($stmt === false) {
                throw New Exception("Unable to do prepared statement: " . $query);
            }
            if( $params ) {
                $this->log($query . " : " . implode(", ", $params));
                $stmt->bind_param(...$params);
            }
            $stmt->execute();
            return $stmt;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
    }
}
