import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/auth';
import { API_URL } from '../config/settings';
import SelectField from '../components/SelectField';
import { Link } from 'react-router-dom';
import { experienceOptions, categoryOptions, styleOptions } from '../data/selectOptions';

export const Sharings = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { currentUser, token } = useAuth();
    const [category, setCategory] = useState('');
    const [style, setStyle] = useState('');
    const [experience, setExperience] = useState('');
    const [filters, setFilters] = useState({
        style: '',
        category: '',
        experience: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        fetchComments();
    }, [filters, currentPage]);

    const fetchComments = async () => {
        const queryParams = new URLSearchParams({
            ...filters,
            page: currentPage
        }).toString();
        const response = await fetch(`${API_URL}/api/v1/comments?${queryParams}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setComments(data.comments);
        setTotalPages(data.total_pages);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // バリデーション
      if (!newComment || !experience || !category || !style) {
          alert('全ての項目を入力してください。');
          return;
      }

      const response = await fetch(`${API_URL}/api/v1/comments`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              comment: {
                  comment: newComment,
                  experience: experience, 
                  category: category, 
                  style: style
              }
          })
      });
      if (response.ok) {
          setNewComment('');
          setExperience(''); 
          setCategory('');  
          setStyle(''); 
          fetchComments();
      }
  };

    const handleLike = async (commentId) => {
        const response = await fetch(`${API_URL}/api/v1/comments/${commentId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            fetchComments();
        }
    };

    const handleDelete = async (commentId) => {
      if (window.confirm('本当にこの投稿を削除しますか？')) {
          try {
              const response = await fetch(`${API_URL}/api/v1/comments/${commentId}`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (response.ok) {
                  // 削除成功後、コメントリストを更新
                  fetchComments();
              } else {
                  const errorData = await response.json();
                  alert(errorData.error || '削除に失敗しました。');
              }
          } catch (error) {
              console.error('Error deleting comment:', error);
              alert('削除中にエラーが発生しました。');
          }
      }
  };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1); // フィルターが変更されたら1ページ目に戻る
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">採用面接情報交換</h2>
            <Link to={`/MyPage`} className="btn btn-ghost">
            マイページへ
            </Link>
          </div>
          <h3 className="card-title mb-4">面接で受けた質問を共有しましょう</h3>
          <div className="alert alert-warning shadow-lg mb-8">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>注意: 個人情報や個別企業名を書くことは禁止です。絶対にやめてください。また、投稿される内容はあくまでも参考程度としてください。</span>
                </div>
            </div>
          
          <div className="card bg-base-200 shadow-xl mb-8">
              <div className="card-body">
                  <h3 className="card-title mb-4">新しい情報を投稿</h3>
                  <form onSubmit={handleSubmit}>
                      <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="textarea textarea-bordered w-full mb-4"
                          placeholder="面接で受けた質問を投稿してください"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <SelectField
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                              options={experienceOptions}
                              placeholder="経験を選択"
                          />
                          <SelectField
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              options={categoryOptions}
                              placeholder="カテゴリを選択"
                          />
                          <SelectField
                              value={style}
                              onChange={(e) => setStyle(e.target.value)}
                              options={styleOptions}
                              placeholder="スタイルを選択"
                          />
                      </div>
                      <button type="submit" className="btn btn-primary w-full">投稿</button>
                  </form>
              </div>
          </div>

          <div className="card bg-base-200 shadow-xl mb-8">
              <div className="card-body">
                  <h3 className="card-title mb-4">フィルター</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SelectField
                          value={filters.experience}
                          onChange={(e) => handleFilterChange('experience', e.target.value)}
                          options={[{ value: '', label: 'すべての経験' }, ...experienceOptions]}
                          placeholder="経験でフィルター"
                      />
                      <SelectField
                          value={filters.category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          options={[{ value: '', label: 'すべてのカテゴリ' }, ...categoryOptions.map(c => ({ value: c, label: c }))]}
                          placeholder="カテゴリでフィルター"
                      />
                      <SelectField
                          value={filters.style}
                          onChange={(e) => handleFilterChange('style', e.target.value)}
                          options={[{ value: '', label: 'すべてのスタイル' }, ...styleOptions.map(s => ({ value: s, label: s }))]}
                          placeholder="スタイルでフィルター"
                      />
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <p className="text-lg mb-2">{comment.comment}</p>
                                <div className="text-sm opacity-70">
                                    <p>経験: {comment.experience}</p>
                                    <p>カテゴリ: {comment.category}</p>
                                    <p>スタイル: {comment.style}</p>
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <button
                                        onClick={() => handleLike(comment.id)}
                                        className="btn btn-sm btn-outline"
                                    >
                                        いいね ({comment.likes_count || 0})
                                    </button>
                                    {currentUser && currentUser.id === comment.user.id && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            削除
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full">コメントはまだありません。</p>
                )}
          </div>

          <div className="btn-group justify-center mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn ${currentPage === page ? 'btn-active' : ''}`}
                  >
                      {page}
                  </button>
              ))}
          </div>
      </div>
  );
};

export default Sharings;