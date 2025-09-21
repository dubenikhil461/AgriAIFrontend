import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset (replace with your dataset path)
data = pd.read_csv("datasets/Crop_recommendation.csv")

# Features and target
X = data.drop("label", axis=1)
y = data["label"]

# Train Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
with open("models/crop_random_forest.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved as models/crop_random_forest.pkl")
