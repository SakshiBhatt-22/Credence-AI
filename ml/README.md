# ML extension (planned)

The running starter uses transparent rules, not ML. To implement a genuine ML component:

1. Choose a public credit dataset with a documented target definition and permission to use it.
2. Separate training and testing by time when appropriate; remove target-leaking features.
3. Train a logistic regression baseline with a scikit-learn `Pipeline` and `ColumnTransformer`.
4. Compare tree-based models, tune thresholds, and assess calibration and subgroup performance.
5. Version the model and serve inference through FastAPI.
6. Document limitations and avoid automatic adverse lending decisions.

This directory intentionally does not claim a trained model exists without a dataset and evaluation.
