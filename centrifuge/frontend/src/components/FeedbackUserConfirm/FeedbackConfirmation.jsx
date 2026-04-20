//v1
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Clock, Mail, Calendar, RefreshCw } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const FeedbackConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const verifyToken = async (token) => {
    try {
      const res = await axiosInstance.get(`/feedbackUser/updatestatus?token=${token}`);
      console.log(res.data);
      setData(res.data);
      setStatus('success');
    } catch (err) {
      const errorMessage = err.response?.data?.error ||
        err.response?.data?.message ||
        'Unable to verify your feedback. Please try again or contact support.';
      setError(errorMessage);
      setStatus('error');
    }
  };

  const token = searchParams.get('token');



  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token || hasVerified.current) return;

    hasVerified.current = true;
    verifyToken(token);
  }, [token]);



  const handleRetry = () => {
    const token = searchParams.get('token');
    if (token) {
      setStatus('loading');
      setError('');
      verifyToken(token);
    }
  };




  const FeedbackStatus = ({ data }) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Feedback Already Submitted
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            You’ve already confirmed your feedback for this event. Thank you for participating! 🎉
          </p>

          {/* Enhanced details section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-yellow-800 mb-3">Verification Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-yellow-600 uppercase tracking-wide font-medium">Email Address</p>
                <p className="text-slate-900 font-semibold mt-1">{data?.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-yellow-600 uppercase tracking-wide font-medium">Event Name</p>
                <p className="text-slate-900 font-semibold mt-1">{data?.eventName || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );




  const LoadingState = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Verifying Your Feedback
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Please wait while we confirm your feedback submission...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const ErrorState = ({ error, handleRetry }) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Verification Failed
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-800 text-sm font-medium leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>


        </div>
      </div>
    </div>
  );

  const SuccessState = ({ data }) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Feedback Confirmed Successfully
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Thank you for your feedback. Your response has been recorded and verified.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Verification Details</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="w-4 h-4 text-slate-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Email Address</p>
                  <p className="text-slate-900 font-medium mt-1">{data?.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="w-4 h-4 text-slate-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Event</p>
                  <p className="text-slate-900 font-medium mt-1">{data?.eventName || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-4 h-4 mt-1 mr-3 flex-shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Status</p>
                  <p className="text-slate-900 font-medium mt-1 capitalize">
                    {data?.status || 'Verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-blue-900 font-medium text-sm">What happens next?</p>
                <p className="text-blue-800 text-sm mt-1 leading-relaxed">
                  Your feedback has been successfully recorded. Our team will review it and may reach out if additional information is needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500 mb-2">Thank you for your participation</p>
        </div>
      </div>
    </div>
  );




  if (status === 'loading') return <LoadingState />;

  if (status === 'success') {
    // If feedback was already submitted, show FeedbackStatus
    if (data?.status === true) {
      return <FeedbackStatus data={data} />;
    }

    // Otherwise, show first-time success
    return <SuccessState data={data} />;
  }

  if (status === 'error') {
    return <ErrorState error={error} handleRetry={handleRetry} />;
  }

  return null;




};

export default FeedbackConfirmation;
