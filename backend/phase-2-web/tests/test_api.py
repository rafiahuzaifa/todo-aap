"""API endpoint tests"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Test health check endpoint"""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_root_redirect(client: AsyncClient):
    """Test root endpoint"""
    response = await client.get("/", follow_redirects=False)
    # Root may redirect or return 200
    assert response.status_code in [200, 307, 308]

