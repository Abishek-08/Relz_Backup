import tensorflow as tf

# tensor T1
T1 =tf.constant([[[10, 11],   #Rank 3 and shape(2,3,2)
                   [20, 20],
                   [30, 30]],
              
                 [ [40, 41],
                   [50, 50],
                   [60, 60]   ]])

# tensor T2
T2= tf.constant([[1, 2, 3],    # Rank 2 and shape (2,3)
                 [4, 5, 6]])

#Adding new axis to T2 by .expand_dims() at its trailing end
broadcasted_T2 = tf.expand_dims(T2, axis=-1)

# arithmetic operation
T3 = broadcasted_T2+ T1
print(T3)


# Working Principle:
# -----------------------
# Step 1: Understanding the Shape of T1

# T1 = tf.constant([
#     [[10, 11],    # Shape: (2,3,2)
#      [20, 20],
#      [30, 30]],

#     [[40, 41],
#      [50, 50],
#      [60, 60]]
# ])

# 📌 Shape of T1: (2,3,2)

#     Rank: 3

#     Breakdown:

#         2 → First dimension (outermost) has 2 elements (2 matrices).

#         3 → Second dimension has 3 rows.

#         2 → Third dimension has 2 columns per row.
# ------------------------------------------------------------------------------------
# Step 2: Understanding the Shape of T2

# T2 = tf.constant([
#     [1, 2, 3],  # Shape: (2,3)
#     [4, 5, 6]
# ])

# 📌 Shape of T2: (2,3)

#     Rank: 2

#     Breakdown:

#         2 → First dimension has 2 elements (2 rows).

#         3 → Second dimension has 3 columns.
# --------------------------------------------------------------------------
# Step 3: Expanding T2's Dimensions

# Since T1 has three dimensions (2,3,2), and T2 has only two dimensions (2,3), TensorFlow cannot directly broadcast T2 to T1.

# To fix this, we add a new axis at the last dimension of T2 using tf.expand_dims():

# broadcasted_T2 = tf.expand_dims(T2, axis=-1)

# Now, T2 transforms into a 3D tensor with shape (2,3,1):

# T2 (before expansion)  →  Shape: (2,3)
# T2 (after expansion)   →  Shape: (2,3,1)

# How T2 changes:

# Before:

# T2 = [
#       [1, 2, 3],
#       [4, 5, 6]
#     ]

# After expand_dims(axis=-1):

# T2 = [
#       [[1], [2], [3]],
#       [[4], [5], [6]]
#     ]

# Now T2 has an extra third dimension with size 1, making it broadcastable to match T1.
# -----------------------------------------------------------------------------------------------------
# Step 4: Broadcasting and Addition

# Now, we perform element-wise addition:

# T3 = broadcasted_T2 + T1

# 📌 New Shapes Before Addition

#     T1: (2,3,2)

#     broadcasted_T2: (2,3,1)

# 📌 Broadcasting Rule Applied

#     Since broadcasted_T2 has 1 in the last dimension, TensorFlow broadcasts it across the last dimension to match T1:

# T2 = [
#       [[1, 1], [2, 2], [3, 3]],
#       [[4, 4], [5, 5], [6, 6]]
#     ]

# Now, broadcasted_T2 becomes (2,3,2), which matches T1, and element-wise addition is performed.
# --------------------------------------------------------------------------------------------------------------
# Step 5: Element-wise Addition

# Now, TensorFlow adds corresponding elements:

# T1 = [[[10, 11], [20, 20], [30, 30]],
#       [[40, 41], [50, 50], [60, 60]]]

# T2 (broadcasted) = [[[1, 1], [2, 2], [3, 3]],
#                     [[4, 4], [5, 5], [6, 6]]]

# Result (T3) = [[[10+1, 11+1], [20+2, 20+2], [30+3, 30+3]],
#                [[40+4, 41+4], [50+5, 50+5], [60+6, 60+6]]]

# T3 = [[[11, 12], [22, 22], [33, 33]],
#       [[44, 45], [55, 55], [66, 66]]]
# --------------------------------------------------------------------------------------
# Final Output

# T3 = [[[11, 12], [22, 22], [33, 33]],
#       [[44, 45], [55, 55], [66, 66]]]






# Conclusion:
# --------------
# ✅ Why was tf.expand_dims(T2, axis=-1) needed?

#     Because T1 had three dimensions (2,3,2), and T2 had only two (2,3).

#     Adding a new dimension made T2 broadcastable.

# ✅ How did broadcasting work?

#     T2 expanded from (2,3,1) to (2,3,2), copying its last dimension.

# ✅ Element-wise addition happened correctly because the shapes matched after broadcasting.