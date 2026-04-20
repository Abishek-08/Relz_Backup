import tensorflow as tf

# Adding a Scalar to a Tensor

a = tf.constant([[1,2,3,4],[5,6,7,8]]) # shape(2,4)
b = tf.constant(2) # shape()

result = a + b # Broadcast b to shape(2,4)
print("Broadcasted Tensor: ")
print(result)



# working Principle:
# ---------------------------
# Step 1: Shape Analysis

#     a has a shape of (2,3) → A 2D tensor (Matrix).

#     b has a shape of () → A scalar (0D tensor, just a single number).
# ----------------------------------------------------------------------------------------
# Step 2: Broadcasting Rules

#     According to broadcasting rules:

#         A scalar (shape ()) can be broadcasted to any shape because it is treated as if it were repeated across all elements.
# -----------------------------------------------------------------------------------------------------------------------------------------
# Step 3: Expansion

#     The scalar b = 10 is expanded to match the shape of a:

# b = [[10, 10, 10],  
#      [10, 10, 10]]  # Now it matches (2,3)
# -----------------------------------------------------------------------------------------------------------------------------------------
# Step 4: Element-wise Addition

# Now, element-wise addition happens:

# a = [[1,  2,  3],  
#      [4,  5,  6]]  

# +  

# b = [[10, 10, 10],  
#      [10, 10, 10]]  

# =  

# [[11, 12, 13],  
#  [14, 15, 16]]



# Conclusion:
# -------------------
# Scalars (()) are always broadcastable to any tensor shape.

# TensorFlow treats the scalar as if it were a tensor filled with that value.

# This is why b automatically expands from () to (2,3), making the addition possible.