from kfp.v2 import dsl
from kfp.v2.dsl import Input, Output, Dataset, Model
 
@dsl.component(
    base_image="python:3.9",
    packages_to_install=["pandas", "scikit-learn"]
)
def data_prep(output_data: Output[Dataset]):
    import pandas as pd
    from sklearn.datasets import load_iris
 
    df = load_iris(as_frame=True).frame
    df.to_csv(output_data.path, index=False)
    print(f"✅ Dataset saved to {output_data.path}")
 
@dsl.component(
    base_image="python:3.9",
    packages_to_install=["pandas", "scikit-learn", "joblib"]
)
def train_model(input_data: Input[Dataset], output_model: Output[Model]):
    import pandas as pd
    from sklearn.linear_model import LogisticRegression
    import joblib
 
    df = pd.read_csv(input_data.path)
    X, y = df.drop("target", axis=1), df["target"]
 
    model = LogisticRegression(max_iter=200)
    model.fit(X, y)
    joblib.dump(model, output_model.path)
    print(f"✅ Model trained and saved to {output_model.path}")
 
@dsl.component(
    base_image="python:3.9",
    packages_to_install=["pandas", "scikit-learn", "joblib"]
)
def evaluate_model(input_data: Input[Dataset], input_model: Input[Model]) -> float:
    import pandas as pd
    import joblib
    from sklearn.metrics import accuracy_score
 
    df = pd.read_csv(input_data.path)
    X, y = df.drop("target", axis=1), df["target"]
 
    model = joblib.load(input_model.path)
    preds = model.predict(X)
    acc = accuracy_score(y, preds)
    print(f"✅ Model Accuracy: {acc}")
    return acc
 
@dsl.pipeline(
    name="ml-poc-minikube",
    description="PoC ML pipeline for Minikube"
)
def ml_poc_pipeline():
    prep_task = data_prep()
    train_task = train_model(input_data=prep_task.outputs["output_data"])
    evaluate_model(
        input_data=prep_task.outputs["output_data"],
        input_model=train_task.outputs["output_model"]
    )
 
# Compile YAML
from kfp.v2 import compiler
if __name__ == "__main__":
    compiler.Compiler().compile(
        pipeline_func=ml_poc_pipeline,
        package_path="ml_poc_minikube.yaml"
    )
    print("✅ YAML 'ml_poc_minikube.yaml' created!")
