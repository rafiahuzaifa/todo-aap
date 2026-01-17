"""Security module tests"""
import pytest
from src.security import hash_password, verify_password


class TestSecurity:
    """Security utilities tests"""
    
    def test_hash_password(self):
        """Test password hashing"""
        password = "TestPassword123"
        hashed = hash_password(password)
        assert hashed != password
        assert len(hashed) > 20
    
    def test_verify_password_correct(self):
        """Test password verification with correct password"""
        password = "TestPassword123"
        hashed = hash_password(password)
        assert verify_password(password, hashed)
    
    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password"""
        password = "TestPassword123"
        wrong_password = "WrongPassword456"
        hashed = hash_password(password)
        assert not verify_password(wrong_password, hashed)
