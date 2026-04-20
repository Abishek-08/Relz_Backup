import tensorflow as tf

# Adding a Column Vector to a Matrix

# shape(2,3)
a = tf.constant([
    [1,2,3],
    [4,5,6]
])
# shape(2,1)
b = tf.constant([
    [10],
    [20]
])

result = a + b # broadcast b to shape(2,3)
print("Broadcasted Tensor: ")
print(result)


# working principle:
# ---------------------------
# Step 1: Shape Analysis

#     a has a shape of (2,3) → A 2D matrix with 2 rows and 3 columns.

#     b has a shape of (2,1) → A column vector with 2 rows and 1 column.
# -----------------------------------------------------------------------------------------
# Step 2: Broadcasting Rules

# Broadcasting rules require that:

#     Dimensions must be equal or one of them must be 1.

#     If a dimension is 1, it can be stretched to match the other tensor.

# Let's compare shapes:

# a = (2,3)
# b = (2,1)

#     The first dimension (2) matches → ✅ No need to change.

#     The second dimension (1) needs to expand to 3 → ✅ TensorFlow broadcasts b to shape (2,3).
# ------------------------------------------------------------------------------------------------------------
# Step 3: Expanding b

# Since b has shape (2,1), TensorFlow automatically expands it by repeating its single column across 3 columns:

# b = [[10],  
#      [20]]  

# # Broadcasting expands b to (2,3):
# b = [[10, 10, 10],  
#      [20, 20, 20]]  
# -------------------------------------------------------------------------------------------------------------------
# Step 4: Element-wise Addition

# Now that both tensors have the same shape (2,3), TensorFlow performs element-wise addition:

# a = [[1,  2,  3],  
#      [4,  5,  6]]  

# +  

# b = [[10, 10, 10],  
#      [20, 20, 20]]  

# =  

# [[11, 12, 13],  
#  [24, 25, 26]]


# Conclusion:
# ---------------
# A column vector with shape (2,1) is broadcasted to match the number of columns in the (2,3) matrix.

# TensorFlow automatically expands the 1 column to 3 columns, making it (2,3).

# Then, TensorFlow performs element-wise addition.


