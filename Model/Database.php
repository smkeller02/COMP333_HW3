<?php
class Database
{
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

    public function insert($query = "" , $params = [])
    {
        try {
            $stmt = $this->executeStatement( $query , $params );
            $stmtResult = $stmt->get_result();
            $stmt->close();
            return true; //ASSUMES SUCCESSFUL INSERT
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
    }
    
    public function delete($query = "" , $params = [])
    {
        try {
            $stmt = $this->executeStatement( $query , $params );
            $stmt->get_result();
            $stmt->close();
            return true; //ASSUMES SUCCESSFUL DELETE
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
    }

    private function executeStatement($query = "" , $params = [])
    {
        try {
            $stmt = $this->connection->prepare( $query );
            if($stmt === false) {
                throw New Exception("Unable to do prepared statement: " . $query);
            }
            if( $params ) {
                $stmt->bind_param(...$params);
            }
            $stmt->execute();
            return $stmt;
        } catch(Exception $e) {
            throw New Exception( $e->getMessage() );
        }
    }
}

?>
