import tensorflow as tf

# What is broadcasting means?
# ---------------------------- 
# Tensor broadcasting in TensorFlow refers to the ability of tensors with different shapes to be automatically expanded to a common shape when performing element-wise operations. 
# This allows operations between tensors of different sizes without explicitly reshaping them.

# Significians:
# -------------
# It is most significant because it helps us to handle many operations where we perform arithmetic operations on two tensors of different shapes, sizes, and dimensions.
# When two tensors are of different shapes, it becomes impossible to perform element-wise arithmetic operations and we have to manually reshape and optimize them so that they match each other's shapes and dimensions. It is too time-consuming and not efficient to do this task manually when we are working with large amounts of data from different categories, where we have to handle complex data such as images data ,speech data and complex scientific computing.
# Broadcasting technique available in these libraries makes our work easier by automatically aligning dimensions ,shapes and sizes of tensors . It makes our codes concise and more readable and optimize.


# Broadcasting Rules:
# ------------------
# TensorFlow follows NumPy's broadcasting rules, which are:

#     Match dimensions from right to left: If two tensors have different ranks (number of dimensions), TensorFlow compares them starting from the last dimension.

#     Compatible dimensions:

#         If two dimensions are equal, they are compatible.

#         If one of the dimensions is 1, it is stretched to match the other dimension.

#         If the dimensions are different and neither is 1, broadcasting is not possible.