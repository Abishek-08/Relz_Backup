from kfp import dsl
from kfp import compiler
 
# Step 1: Print message and return it
@dsl.component
def print_op(message: str) -> str:
    print(message)
    return message
 
# Step 2: Convert to uppercase and return it
@dsl.component
def uppercase_op(text: str) -> str:
    return text.upper()
 
# Pipeline definition
@dsl.pipeline(
    name="Simple Demo Pipeline",
    description="A minimal pipeline for PoC"
)
def simple_pipeline(msg: str = "Hello Kubeflow!"):
    # Step 1
    step1 = print_op(message=msg)
 
    # Step 2
    step2 = uppercase_op(text=step1.output)
 
    # Step 3
    print_op(message=step2.output)
 
 
if __name__ == "__main__":
    compiler.Compiler().compile(
        pipeline_func=simple_pipeline,
        package_path="simple_pipeline.yaml"
    )
 