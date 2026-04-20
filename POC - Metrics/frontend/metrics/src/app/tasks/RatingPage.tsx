"use client";
import { useState, useEffect } from 'react';
import { Star, Plus, X, Search, Edit2, Trash2, MessageSquare } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import {
  getRatings,
  addRating,
  updateRating,
  deleteRating,
} from "@/services/RatingService";

interface Rating {
  id: number;         
  technical: number;
  behaviour: number; 
  overAll: number;
  comments?: string;
  taskId: number;  
}

interface FormData {
  technical: number;
  behaviour: number;  
  overAll: number;
  comments: string;
  taskId: string; 
}

export default function Rating() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    technical: 0,
    behaviour: 0,
    overAll: 0,
    comments: '',
    taskId: ''
  });

  useEffect(() => {
    fetchAllRatings();
  }, []);

  const fetchAllRatings = () => {
    getRatings()
      .then((res) => {
        console.log("API Response:", res.data);
        
        const validRatings = Array.isArray(res.data) ? res.data.filter(rating => 
          rating && 
          rating.id != null && 
          rating.taskId != null && 
          typeof rating.technical === 'number' && 
          typeof rating.behaviour === 'number'
        ) : [];
        
        console.log("Valid Ratings:", validRatings);
        setRatings(validRatings);
        
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch ratings");
        setRatings([]);
      });
  };

  const handleAddRating = async (): Promise<void> => {
    if (!formData.taskId.trim()) {
      toast.error("Task ID is required");
      return;
    }

    if (formData.technical <= 0 || formData.technical > 5) {
      toast.error("Technical rating must be between 0.1 and 5");
      return;
    }

    if (formData.behaviour <= 0 || formData.behaviour > 5) {
      toast.error("Behavioural rating must be between 0.1 and 5");
      return;
    }

    const overAll = ((formData.technical + formData.behaviour) / 2);
    const ratingData = {
      technical: parseFloat(formData.technical.toFixed(2)),
      behaviour: parseFloat(formData.behaviour.toFixed(2)),
      overAll: parseFloat(overAll.toFixed(2)),
      comments: formData.comments.trim(),
      taskId: parseInt(formData.taskId) 
    };

    console.log("Submitting rating data:", ratingData);

    try {
      if (editingId) {
        const response = await updateRating(editingId, ratingData);
        console.log("Update response:", response.data);
        toast.success("Rating updated successfully");
      } else {
        const response = await addRating(ratingData);
        console.log("Add response:", response.data);
        toast.success("Rating added successfully");
      }
      
      handleCloseModal();
      
      setTimeout(() => {
        fetchAllRatings();
      }, 300);
    } catch (error: any) {
      console.error("Submit error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Operation failed. Please try again.");
    }
  };

  const handleEditRating = (rating: Rating): void => {
    setFormData({
      technical: rating.technical || 0,
      behaviour: rating.behaviour || 0,
      overAll: rating.overAll || 0,
      comments: rating.comments || '',
      taskId: rating.taskId?.toString() || ''
    });
    setEditingId(rating.id);
    setShowAddModal(true);
  };

  const handleCloseModal = (): void => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({
      technical: 0,
      behaviour: 0,
      overAll: 0,
      comments: '',
      taskId: ''
    });
  };

  const handleDeleteRating = async (id: number): Promise<void> => {
    if (!window.confirm("Delete this rating?")) return;
    
    try {
      await deleteRating(id);
      toast.success("Rating deleted successfully");
      fetchAllRatings();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  const getStarColor = (rating: number): string => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 3.5) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getRatingBadge = (rating: number): { label: string; color: string } => {
    if (rating >= 4.5) return { label: 'Excellent', color: 'bg-green-100 text-green-700' };
    if (rating >= 3.5) return { label: 'Good', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Fair', color: 'bg-orange-100 text-orange-700' };
  };

  const filteredRatings: Rating[] = ratings.filter(rating => {

    const taskId = rating.taskId?.toString().toLowerCase() || '';
    const comments = rating.comments?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = taskId.includes(search) || comments.includes(search);
    
    const matchesFilter = filterRating === 'all' ||
                         (filterRating === 'excellent' && rating.overAll >= 4.5) ||
                         (filterRating === 'good' && rating.overAll >= 3.5 && rating.overAll < 4.5) ||
                         (filterRating === 'fair' && rating.overAll < 3.5);
    return matchesSearch && matchesFilter;
  });

  interface StarRatingProps {
    rating: number;
    size?: number;
  }

  const StarRating: React.FC<StarRatingProps> = ({ rating, size = 5 }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-${size} h-${size} ${i < Math.floor(rating) ? getStarColor(rating) : 'text-gray-300'} fill-current`}
          />
        ))}
        <span className={`ml-2 font-semibold ${getStarColor(rating)}`}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header Section */} 
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-200"> 
        <div> 
          <h1 className="text-3xl font-bold text-gray-900">Ratings</h1> 
          <p className="text-gray-600 text-sm mt-1">Manage your ratings efficiently</p> 
        </div> 
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Rating
        </button>
      </div> 

      <div className="px-8 py-6 space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Task ID or comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Ratings</option>
              <option value="excellent">Excellent (4.5+)</option>
              <option value="good">Good (3.5-4.5)</option>
              <option value="fair">Fair (&lt;3.5)</option>
            </select>
          </div>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRatings.map((rating) => {
            const badge = getRatingBadge(rating.overAll);
            return (
              <div key={rating.id} className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white p-2 rounded-lg">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Task ID: {rating.taskId}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${badge.color} font-medium`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditRating(rating)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRating(rating.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Overall Rating */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="text-sm text-gray-600 mb-2">Overall Rating</div>
                    <StarRating rating={rating.overAll} />
                  </div>

                  {/* Technical and Behavioural Ratings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <div className="text-xs text-gray-600 mb-2">Technical</div>
                      <StarRating rating={rating.technical} size={4} />
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                      <div className="text-xs text-gray-600 mb-2">Behavioural</div>
                      <StarRating rating={rating.behaviour} size={4} />
                    </div>
                  </div>

                  {/* Comments */}
                  {rating.comments && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">Comments</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{rating.comments}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredRatings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Ratings Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Add/Edit Rating Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Rating' : 'Add New Rating'}</h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Task ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task ID * (numeric)
                </label>
                <input
                  type="number"
                  value={formData.taskId}
                  onChange={(e) => setFormData({...formData, taskId: e.target.value})}
                  placeholder="e.g., 12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Technical Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technical Rating * (0.1-5)
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={formData.technical === 0 ? '' : formData.technical}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    setFormData({...formData, technical: Math.min(5, Math.max(0, value))});
                  }}
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Behavioural Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Behavioural Rating * (0.1-5)
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={formData.behaviour === 0 ? '' : formData.behaviour}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    setFormData({...formData, behaviour: Math.min(5, Math.max(0, value))});
                  }}
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Overall Preview */}
              {formData.technical > 0 && formData.behaviour > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">Overall Rating (Auto-calculated)</div>
                  <StarRating rating={(formData.technical + formData.behaviour) / 2} />
                </div>
              )}

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="Add detailed feedback..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRating}
                  disabled={!formData.taskId || !formData.technical || !formData.behaviour}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {editingId ? 'Update Rating' : 'Add Rating'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}