 export const gradeColor = (g) =>
    ({ A: 'badge-a', B: 'badge-b', C: 'badge-c', D: 'badge-d', F: 'badge-f' }[g] || 'badge-default');


 export const navItems = [
   { label: 'Dashboard',   path: '/',            icon: 'gauge' },
   { section: 'Management' },
   { label: 'Students',    path: '/students',    icon: 'user-graduate' },
   { label: 'Courses',     path: '/courses',     icon: 'book' },
   { label: 'Enrollments', path: '/enrollments', icon: 'clipboard-list' },
   { label: 'Results',     path: '/results',     icon: 'chart-line' },
 ];
 