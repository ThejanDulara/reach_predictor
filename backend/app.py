from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from joblib import load
from functools import lru_cache
from scipy.ndimage import gaussian_filter1d
import os

app = Flask(__name__)
CORS(app)

# ---- Model path (single model) ---------------------------------------------
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_FILE = "gradient_boosting_model.joblib"   # <-- place your single model here
# ---------------------------------------------------------------------------

@lru_cache(maxsize=1)
def get_model():
    path = os.path.join(MODEL_DIR, MODEL_FILE)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found at: {path}")
    return load(path)

def predict_reach_array(model, grp_array_1d):
    """
    model: scikit-learn regressor (expects shape (n,1))
    grp_array_1d: shape (n,)
    returns: reach predictions shape (n,)
    """
    X = grp_array_1d.reshape(-1, 1)
    y = model.predict(X)
    return y

def find_stagnation(grp, reach, diff_threshold):
    """
    Find first index where consecutive diff(reach) < diff_threshold.
    Returns (grp_value, reach_value, idx). If not found, returns last point.
    """
    diffs = np.diff(reach)
    idxs = np.where(diffs < diff_threshold)[0]
    if idxs.size > 0:
        i = int(idxs[0])
        return grp[i], reach[i], i
    # fallback: last point
    return grp[-1], reach[-1], len(grp) - 1

@app.route("/healthz")
def healthz():
    return {"status": "ok"}, 200

@app.route("/", methods=["GET"])
def home():
    return jsonify({"ok": True, "message": "Reach Predictor backend running"}), 200

@app.route("/api/predict", methods=["POST"])
def api_predict():
    """
    Body: { "grp": number }
    Returns: { "grp": number, "reach": number }
    """
    data = request.get_json(silent=True) or {}
    grp = float(data.get("grp", 0))
    try:
        model = get_model()
        reach = float(model.predict(np.array([[grp]]))[0])
        return jsonify({"grp": grp, "reach": reach})
    except Exception as e:
        return jsonify({"error": "prediction_failed", "details": str(e)}), 500

@app.route("/api/curve", methods=["POST"])
def api_curve():
    """
    Body: {
      "grp_min": number (default 25),
      "grp_max": number (default 10000),
      "points":  number (default 250),
      "threshold": number (default 0.01),   # consecutive diff threshold
      "smooth_sigma": number (optional, default 0)  # optional smoothing for nicer curves
    }
    Returns:
    {
      "grp": [ ... ],
      "reach": [ ... ],
      "stagnation": { "grp": x, "reach": y, "index": i },
      "threshold": t
    }
    """
    data = request.get_json(silent=True) or {}
    grp_min = float(data.get("grp_min", 25))
    grp_max = float(data.get("grp_max", 10000))
    points  = int(data.get("points", 250))
    threshold = float(data.get("threshold", 0.01))
    smooth_sigma = float(data.get("smooth_sigma", 0))

    try:
        model = get_model()
        grp = np.linspace(grp_min, grp_max, points)
        reach = predict_reach_array(model, grp)

        if smooth_sigma and smooth_sigma > 0:
            reach = gaussian_filter1d(reach, sigma=smooth_sigma)

        stag_grp, stag_reach, stag_idx = find_stagnation(grp, reach, threshold)

        return jsonify({
            "grp": grp.tolist(),
            "reach": reach.tolist(),
            "stagnation": {"grp": float(stag_grp), "reach": float(stag_reach), "index": int(stag_idx)},
            "threshold": threshold
        })
    except Exception as e:
        return jsonify({"error": "curve_failed", "details": str(e)}), 500

if __name__ == "__main__":
    # Railway/Render-style PORT if present
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)), debug=False)
