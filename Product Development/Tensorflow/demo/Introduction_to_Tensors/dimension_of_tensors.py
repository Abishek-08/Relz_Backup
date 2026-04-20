import tensorflow as tf

# Scalar (O-D) - 'Zero-Dimensional'
scalar_tf = tf.constant(4)

# Vector (1-D) - 'One-Dimensional' 
vector_tf = tf.constant([1,2,3])

# Matrix (2-D) - 'Two-Dimensional' 
matrix_tf = tf.constant([[1,2,3],[4,5,6]])

# Tenosr (3-D) - 'Three-Dimensional'
tensor_3d_tf =  tf.constant([[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]],[[13,14,15],[16,17,18]]])

# Tensor (4-D) - 'Four-Dimesional'
tensor_4d_tf = tf.constant([[[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]],[[13,14,15],[16,17,18]]],[[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]],[[13,14,15],[16,17,18]]]])


list_of_tensor = {'scalar_tf':scalar_tf,'vector_tf':vector_tf,'matrix_tf':matrix_tf,'tensor_3d_tf':tensor_3d_tf,'tensor_4d_tf':tensor_4d_tf}

for name in list_of_tensor:
    shape = list_of_tensor[name].shape

    if len(shape) == 0:
        print(f'Shape of the {name}: ',shape)
        print('No Dimension for this tensor')
        print("------------------------------------------------------")
    elif len(shape) == 1:
        print(f'Shape of the {name}: ',shape)
        print(f'Dimension of the first-axis is: {shape[0]}')
        print("------------------------------------------------------")
    elif len(shape) == 2:
        print(f'Shape of the {name}: ',shape)
        print(f'Dimension of the first-axis is: {shape[0]}')
        print(f'Dimension of the second-axis is: {shape[1]}')
        print("------------------------------------------------------")
    elif len(shape) == 3:
        print(f'Shape of the {name}: ',shape)
        print(f'Dimension of the first axis is: {shape[0]}')
        print(f'Dimension of the second-axis is: {shape[1]}')
        # The 3rd-axis dimensional count will give the number of combination of the 2D-tensor in 3D-tensor
        print(f'Dimension of the third-axis is: {shape[2]}')
        print("------------------------------------------------------")
    elif len(shape) == 4:
        print(f'Shape of the {name}: ',shape)
        print(f'Dimension of the first axis is: {shape[0]}')
        print(f'Dimension of the second-axis is: {shape[1]}')
        # The 3rd-axis dimensional count will give the number of combination of the 2D-tensor in 3D-tensor
        print(f'Dimension of the third-axis is: {shape[2]}')
        # The 4th-axis dimensional count will give the number of combination of 3D-tensor in 4D-tensor
        print(f'Dimension of the four-axis is: {shape[3]}')
        print("------------------------------------------------------")
    



