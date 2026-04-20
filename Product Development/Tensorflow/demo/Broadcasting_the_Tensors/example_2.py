import tensorflow as tf

# Adding a 1D Vector to a 2D Matrix

# shape(2,3)
a = tf.constant([
    [1,2,3],
    [4,5,6]
])
# shape(3,)
b = tf.constant([10,20,30])

result = a + b # broadcast b to shape(2,4)
print("Broadcasted Tensor: ")
print(result)

# working principle:
# --------------------------------
# Step 1: Shape Analysis

#     a has a shape of (2,3) → A 2D matrix with 2 rows and 3 columns.

#     b has a shape of (3,) → A 1D vector with 3 elements.
# ----------------------------------------------------------------------------------
# Step 2: Broadcasting Rules

# Broadcasting rules require that dimensions match or one of them must be 1:

#     Since b has only one dimension, TensorFlow automatically expands it to match a.

#     TensorFlow assumes b is a row vector and treats it as if it had a shape of (1,3).
# ------------------------------------------------------------------------------------------
# Step 3: Expanding b

# TensorFlow implicitly reshapes b from (3,) to (1,3):

# b = [[10, 20, 30]]  # Now b has shape (1,3)

# Now, we compare the shapes:

#     a: (2,3)

#     b: (1,3) → Can be broadcasted to (2,3) by repeating its row.

# So b expands to:

# b = [[10, 20, 30],  
#      [10, 20, 30]]  # Now b matches (2,3)
# ------------------------------------------------------------------------------------------
# Step 4: Element-wise Addition

# Now that both tensors have the same shape (2,3), TensorFlow performs element-wise addition:

# a = [[1,  2,  3],  
#      [4,  5,  6]]  

# +  

# b = [[10, 20, 30],  
#      [10, 20, 30]]  

# =  

# [[11, 22, 33],  
#  [14, 25, 36]]
