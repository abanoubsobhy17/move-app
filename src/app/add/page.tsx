"use client";
import { useState } from 'react';

export default function AddReview() {
  const [rating, setRating] = useState<number | ''>('');
  const [comment, setComment] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Simulate API call
    try {
      const formData = new FormData();
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      if (file) {
        formData.append('file', file);
      }

      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log({ rating, comment, file });
      setSuccess(true);
    } catch (err) {
      setError('An error occurred while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add Your Review</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4">
            Thank you! Your review has been submitted successfully.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-2">
              Rating (1-10)
            </label>
            <input
              type="number"
              id="rating"
              placeholder="Enter your rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500"
              min="1"
              max="10"
              required
            />
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Your Comment
            </label>
            <textarea
              id="comment"
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500"
              rows={5}
              required
            />
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium mb-2">
              Upload a File (Image or Video)
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-500"
              accept="image/*, video/*"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}