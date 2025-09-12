import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import { Task } from '../../../../lib/models';
import TaskForm from '../../../../components/TaskForm';

export default async function EditTaskPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  const task = await Task.findOne({ _id: params.id, userId: session.user.id }).lean();

  if (!task) {
    redirect('/dashboard');
  }
// MongoDB obj to plain obj
  const taskData = {
    _id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Edit Task</h1>
      <TaskForm task={taskData} />
    </div>
  );
}