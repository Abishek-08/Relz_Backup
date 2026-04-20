import tensorflow as tf

# Incompatible Shapes (Error Case)

a = tf.constant([[1, 2, 3], [4, 5, 6]])  # Shape: (2,3)
b = tf.constant([10, 20])  # Shape: (2,)

result = a + b  # This will cause an error

# working principle:
# ------------------------
# Step 1: Shape Analysis

#     a has a shape of (2,3) → A 2D matrix with 2 rows and 3 columns.

#     b has a shape of (2,) → A 1D vector with 2 elements.
# --------------------------------------------------------------------------------
# Step 2: Why Does Broadcasting Fail?

# According to TensorFlow’s broadcasting rules, TensorFlow attempts to align the dimensions from right to left. Let's compare:

# a = (2,3)
# b = (2,)

# Checking Broadcasting Rules:

#     Compare last dimension:

#         a has 3 columns, but b only has 2 elements. ❌ Mismatch!

#     Compare second-last dimension:

#         a has 2 rows, and b has 2 elements (which could act as rows). ✅ Match!

# Because the last dimension (3 ≠ 2) does not match and neither is 1, broadcasting is NOT possible, and TensorFlow throws an error.
# ---------------------------------------------------------------------------------------------------------------------------------------------------
# Step 3: Understanding the Error

# When we try to add a + b, TensorFlow raises an error:

# InvalidArgumentError: Incompatible shapes: [2,3] vs. [2]

# This error means:

#     The shapes (2,3) and (2,) cannot be broadcasted because the last dimensions do not match and neither is 1.




# *******************************How to Fix It****************************************
# If we want broadcasting to work, we must reshape b to a compatible shape.
# Option 1: Reshape b to a row vector (1,2) (Incorrect)

# If we try:

# b = tf.reshape(b, (1,2))  # Shape (1,2)

# This still won't work because the last dimension (2 ≠ 3) doesn't match.
# ----------------------------------------------------------------------------------------------
# Option 2: Reshape b to a column vector (2,1) (Correct)

# If we reshape b to (2,1) and broadcast it:

# b = tf.reshape(b, (2,1))  # Shape (2,1)
# result = a + b  # This will now work!

# This works because:

# a = (2,3)
# b = (2,1)  → Broadcasts to (2,3)

# Now, b expands to (2,3) and addition works.






# *********Conclusion*******
# Broadcasting requires dimensions to match or contain 1 so they can be expanded.

# In Example 4, the last dimensions (3 ≠ 2) do not match, so broadcasting fails.

# To fix it, reshape b to (2,1), allowing it to be broadcasted to (2,3).
