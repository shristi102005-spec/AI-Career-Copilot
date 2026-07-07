from app.services.tailoring_engine import ResumeTailoringEngine


def test_tailoring_engine_returns_schema():

    engine = ResumeTailoringEngine()

    result = engine.tailor_resume(
        "Python developer with ML projects",
        "Looking for Python AI engineer"
    )

    assert "ats_score" in result
    assert "tailored_summary" in result
    assert "tailored_projects" in result
    assert "changes" in result