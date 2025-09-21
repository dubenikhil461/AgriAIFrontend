# crop_random_forest.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# 1. Load dataset
df = pd.read_csv("Datasets/Crop_recommendation.csv")   # <-- update path if needed
print("Dataset shape:", df.shape)
print(df.head())

# 2. Features and Target
X = df.drop("label", axis=1)
y = df["label"]

# 3. Encode target labels (crop names → numbers)
le = LabelEncoder()
y_encoded = le.fit_transform(y)
print("Crops:", list(le.classes_))

# 4. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# 5. Feature Scaling (good practice for some models, safe for RF too)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 6. Train Random Forest Classifier
rf = RandomForestClassifier(
    n_estimators=200,   # number of trees
    max_depth=None,     # let it grow fully
    random_state=42,
    n_jobs=-1           # use all CPU cores
)
rf.fit(X_train_scaled, y_train)

# 7. Evaluate Model
y_pred = rf.predict(X_test_scaled)
print("\n✅ Accuracy:", accuracy_score(y_test, y_pred))
print("\n📊 Classification Report:\n", classification_report(y_test, y_pred, target_names=le.classes_))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

# 8. Save model, scaler, and label encoder
joblib.dump(rf, "crop_rf_model.pkl")
joblib.dump(scaler, "crop_scaler.pkl")
joblib.dump(le, "crop_labelencoder.pkl")
print("\n🎉 Model, Scaler & LabelEncoder saved successfully!")
