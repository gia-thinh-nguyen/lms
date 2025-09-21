'use client'
import React, { useState } from 'react'
import { useUpdateCourseDirector } from '@/hooks/teacher/useUpdateCourseDirector'

const CourseDirector = ({ 
    course, 
    teachers = [], 
    onCourseUpdate 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDirectorId, setSelectedDirectorId] = useState('');
    const { updateCourseDirector, loading, error, success } = useUpdateCourseDirector();

    const currentDirector = course.courseDirectorId;
    
    const handleEditClick = () => {
        setIsEditing(true);
        setSelectedDirectorId(currentDirector?._id || currentDirector || '');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedDirectorId('');
    };

    const handleSave = async () => {
        if (!selectedDirectorId) {
            alert('Please select a course director');
            return;
        }

        try {
            const updatedCourse = await updateCourseDirector(course.courseId, selectedDirectorId);
            
            // Call the parent component's update function if provided
            if (onCourseUpdate) {
                onCourseUpdate(updatedCourse);
            }
            
            setIsEditing(false);
            setSelectedDirectorId('');
        } catch (err) {
            // Error is handled by the hook
            console.error('Failed to update course director:', err);
        }
    };

    const getDirectorDisplayInfo = () => {
        if (typeof currentDirector === 'object' && currentDirector !== null) {
            return {
                name: currentDirector.name || 'Unknown',
                email: currentDirector.email || 'Course Director'
            };
        }
        
        // If currentDirector is just an ID, try to find the teacher in the teachers list
        const foundTeacher = teachers.find(teacher => 
            teacher.id === currentDirector || teacher._id === currentDirector
        );
        
        if (foundTeacher) {
            return {
                name: `${foundTeacher.firstName} ${foundTeacher.lastName}`,
                email: foundTeacher.emailAddress
            };
        }
        
        return {
            name: 'Unknown',
            email: 'Course Director'
        };
    };

    const directorInfo = getDirectorDisplayInfo();

    return (
        <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Course Director</h2>
                {!isEditing ? (
                    <button 
                        onClick={handleEditClick}
                        className="btn btn-sm btn-outline btn-primary"
                    >
                        Change Director
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={handleCancel}
                            className="btn btn-sm btn-outline"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="btn btn-sm btn-primary"
                            disabled={loading || !selectedDirectorId}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-4">
                    <span>Course director updated successfully!</span>
                </div>
            )}

            {!isEditing ? (
                <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                            <span className="text-xl">
                                {directorInfo.name.split(' ').map(n => n[0]).join('') || '?'}
                            </span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold">{directorInfo.name}</h3>
                        <p className="text-gray-600">{directorInfo.email}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Select New Course Director</span>
                        </label>
                        <select 
                            className="select select-bordered w-full"
                            value={selectedDirectorId}
                            onChange={(e) => setSelectedDirectorId(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Choose a teacher...</option>
                            {teachers.map((teacher) => (
                                <option 
                                    key={teacher.id} 
                                    value={teacher.id}
                                >
                                    {teacher.firstName} {teacher.lastName} - {teacher.emailAddress}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDirector;