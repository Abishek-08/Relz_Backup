import React, { useState, useEffect } from 'react'; 

import { Calendar, Star, Zap, Clock, Users, MapPin, Sparkles } from 'lucide-react'; 

 

const NoEventSelected = ({openModal}) => { 

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); 

  const [hovering, setHovering] = useState(false); 

 

  useEffect(() => { 

    const handleMouseMove = (e) => { 

      const rect = e.currentTarget?.getBoundingClientRect(); 

      if (rect) { 

        setMousePosition({ 

          x: e.clientX - rect.left, 

          y: e.clientY - rect.top, 

        }); 

      } 

    }; 

 

    const container = document.getElementById('no-event-container'); 

    container?.addEventListener('mousemove', handleMouseMove); 

    return () => container?.removeEventListener('mousemove', handleMouseMove); 

  }, []); 

 

  const floatingIcons = [ 

    { Icon: Star, delay: 0, size: 20 }, 

    { Icon: Zap, delay: 1, size: 24 }, 

    { Icon: Clock, delay: 2, size: 18 }, 

    { Icon: Users, delay: 0.5, size: 22 }, 

    { Icon: MapPin, delay: 1.5, size: 20 }, 

    { Icon: Sparkles, delay: 2.5, size: 16 } 

  ]; 

 

  return ( 

    <div  

      id="no-event-container" 

      className="flex flex-col items-center justify-center h-full max-w-9xl relative overflow-hidden" 

      onMouseEnter={() => setHovering(true)} 

      onMouseLeave={() => setHovering(false)} 

    > 


 

      {/* Floating icons - Updated colors */} 

      {floatingIcons.map(({ Icon, delay, size }, index) => ( 

        <div 

          key={index} 

          className="absolute animate-bounce opacity-30" 

          style={{ 

            left: `${15 + (index * 15)}%`, 

            top: `${20 + (index * 8)}%`, 

            animationDelay: `${delay}s`, 

            animationDuration: `${3 + index * 0.5}s` 

          }} 

        > 

          <Icon size={size} className="text-slate-600" /> 

        </div> 

      ))} 

 

      {/* Main content container */} 

      <div className="relative w-full max-w-4xl mx-auto px-8 z-10"> 

        {/* Interactive hover effect - Updated color */} 

        {hovering && ( 

          <div 

            className="absolute pointer-events-none transition-all duration-300 ease-out" 

            style={{ 

              left: mousePosition.x - 100, 

              top: mousePosition.y - 100, 

              width: 200, 

              height: 200, 

              background: 'radial-gradient(circle, rgba(39, 76, 119, 0.1) 0%, transparent 70%)', 

              borderRadius: '50%', 

            }} 

          /> 

        )} 

 

        {/* Main card with enhanced effects */} 

        <div className="relative group"> 

          {/* Multiple gradient borders for depth - Updated with brand colors */} 

          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-3xl blur-sm opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div> 

          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 rounded-3xl blur-xs opacity-20 group-hover:opacity-40 transition duration-1000"></div> 

             

          {/* Main content card - Updated background */} 

          <div className="relative bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-16 shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500"> 

               

            {/* Animated center icon */} 

            <div className="flex justify-center mb-12"> 

              <div className="relative group-hover:scale-110 transition-transform duration-500"> 

                {/* Pulsing rings - Updated colors */} 

                <div className="absolute inset-0 rounded-full animate-pulse"> 

                  <div className="w-32 h-32 border-2 border-blue-400/30 rounded-full absolute animate-spin" style={{ animationDuration: '8s', color: '#274c77' }}></div> 

                  <div className="w-40 h-40 border-2 border-indigo-400/20 rounded-full absolute -top-4 -left-4 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div> 

                </div> 

                   

                {/* Main icon container - Updated with brand colors */} 

                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm rounded-full p-8 border-2 border-blue-200 shadow-lg" style={{ borderColor: '#274c77' }}> 

                  <Calendar size={64} className="text-blue-700" style={{ color: '#274c77' }} /> 

                     

                  {/* Icon decorations - Updated colors */} 

                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse" style={{ background: 'linear-gradient(45deg, #274c77, #5a7db8)' }}></div> 

                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div> 

                </div> 

              </div> 

            </div> 

               

            {/* Enhanced typography - Updated colors */} 

            <div className="text-center mb-10"> 

              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-black mb-4 tracking-tight"> 

                No Event Found for this Category

              </h1> 

                 

              {/* Animated underline - Updated with brand color */} 

              <div className="flex justify-center mb-6"> 

                <div className="w-32 h-1.5 rounded-full relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #274c77, #5a7db8, #274c77)' }}> 

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div> 

                </div> 

              </div> 

                 

              <p className="text-xl text-white leading-relaxed max-w-2xl mx-auto font-light"> 

                Please create a new event

              </p> 

            </div> 

               

            {/* Call to action with animation - Updated with brand colors */} 

            <div className="text-center"> 

              <div  onClick={openModal} className="inline-flex items-center space-x-3 px-8 py-4 backdrop-blur-sm border-2 rounded-full transition-all duration-500 hover:shadow-lg cursor-pointer bg-gradient"  

                   style={{  

                     backgroundColor: 'rgba(39, 76, 119, 0.1)',  

                     borderColor: '#274c77', 

                     ':hover': { backgroundColor: 'rgba(39, 76, 119, 0.2)' } 

                   }} 

                   onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(39, 76, 119, 0.2)'} 

                   onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(39, 76, 119, 0.1)'} 

              > 

                <Sparkles size={20} className="animate-pulse" style={{ color: '#ffffff' }} /> 

                <span className="font-semibold text-lg" style={{ color: '#ffffff' }}>Create a new Event</span> 

                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ffffff' }}></div> 

              </div> 

            </div> 

               

            {/* Decorative corner elements - Updated colors */} 

            <div className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse" style={{ background: 'linear-gradient(45deg, #274c77, #5a7db8)' }}></div> 

            <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div> 

            <div className="absolute top-1/3 right-8 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: '#274c77', animationDelay: '2s' }}></div> 

          </div> 

        </div> 

      </div> 

         

      {/* Enhanced background pattern - Updated colors */} 

      <div className="absolute inset-0 opacity-10 pointer-events-none"> 

        <div className="absolute top-10 left-20 w-40 h-40 border border-blue-300/30 rounded-full animate-pulse"></div> 

        <div className="absolute bottom-20 right-32 w-32 h-32 border border-indigo-300/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div> 

        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-slate-300/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div> 

        <div className="absolute top-3/4 right-1/4 w-16 h-16 border border-blue-300/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div> 

      </div> 

    </div> 

  ); 

}; 

 

export default NoEventSelected; 


// import React, { useState, useEffect } from 'react'; 

// import { 

//   Calendar, Star, Zap, Clock, Users, MapPin, Sparkles, 

//   BarChart3, LineChart, PieChart, TrendingUp, BarChart2, Activity, 

// } from 'lucide-react'; 

// import { 

//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 

//   ResponsiveContainer, LineChart as RechartsLineChart, Line, 

//   PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area 

// } from 'recharts'; 

 

// // NoEventSelected Component 

// const NoEventSelected = () => { 

//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); 

//   const [hovering, setHovering] = useState(false); 

 

//   useEffect(() => { 

//     const handleMouseMove = (e) => { 

//       const rect = e.currentTarget?.getBoundingClientRect(); 

//       if (rect) { 

//         setMousePosition({ 

//           x: e.clientX - rect.left, 

//           y: e.clientY - rect.top, 

//         }); 

//       } 

//     }; 

//     const container = document.getElementById('no-event-container'); 

//     container?.addEventListener('mousemove', handleMouseMove); 

//     return () => container?.removeEventListener('mousemove', handleMouseMove); 

//   }, []); 

 

//   const floatingIcons = [ 

//     { Icon: Star, delay: 0, size: 20 }, 

//     { Icon: Zap, delay: 1, size: 24 }, 

//     { Icon: Clock, delay: 2, size: 18 }, 

//     { Icon: Users, delay: 0.5, size: 22 }, 

//     { Icon: MapPin, delay: 1.5, size: 20 }, 

//     { Icon: Sparkles, delay: 2.5, size: 16 }, 

//   ]; 

 

//   return ( 

//     <div 

//       id="no-event-container" 

//       className="relative h-full w-full flex items-center justify-center" 

//       onMouseEnter={() => setHovering(true)} 

//       onMouseLeave={() => setHovering(false)} 

//     > 

//       {/* Floating icons */} 

//       {floatingIcons.map(({ Icon, delay, size }, index) => ( 

//         <div 

//           key={index} 

//           className="absolute animate-bounce opacity-30" 

//           style={{ 

//             left: `${15 + index * 15}%`, 

//             top: `${20 + index * 8}%`, 

//             animationDelay: `${delay}s`, 

//             animationDuration: `${3 + index * 0.5}s`, 

//           }} 

//         > 

//           <Icon size={size} /> 

//         </div> 

//       ))} 

 

//       {/* Hover effect */} 

//       {hovering && ( 

//         <div 

//           className="absolute pointer-events-none transition-all duration-300 ease-out" 

//           style={{ 

//             left: mousePosition.x - 100, 

//             top: mousePosition.y - 100, 

//             width: 200, 

//             height: 200, 

//             background: 'radial-gradient(circle, rgba(39, 76, 119, 0.1) 0%, transparent 70%)', 

//             borderRadius: '50%', 

//           }} 

//         /> 

//       )} 

 

//       {/* Main Card */} 

//       <div className="relative group"> 

//         <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 rounded-3xl blur-sm opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse"></div> 

//         <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-700 rounded-3xl blur-xs opacity-20 group-hover:opacity-40 transition duration-1000"></div> 

 

//         <div className="relative bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-16 shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500"> 

//           <div className="flex justify-center mb-12"> 

//             <div className="relative group-hover:scale-110 transition-transform duration-500"> 

//               <div className="absolute inset-0 rounded-full animate-pulse"> 

//                 <div className="w-32 h-32 border-2 border-blue-400/30 rounded-full absolute animate-spin" style={{ animationDuration: '8s' }}></div> 

//                 <div className="w-40 h-40 border-2 border-indigo-400/20 rounded-full absolute -top-4 -left-4 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div> 

//               </div> 

//               <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm rounded-full p-8 border-2 border-blue-200 shadow-lg"> 

//                 <Calendar size={64} className="text-blue-700" /> 

//                 <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse" style={{ background: 'linear-gradient(45deg, #274c77, #5a7db8)' }}></div> 

//                 <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div> 

//               </div> 

//             </div> 

//           </div> 

 

//           <div className="text-center mb-10"> 

//             <h1 className="text-5xl font-black text-transparent bg-clip-text bg-black mb-4 tracking-tight"> 

//               No Events Available 

//             </h1> 

//             <div className="flex justify-center mb-6"> 

//               <div className="w-32 h-1.5 rounded-full relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #274c77, #5a7db8, #274c77)' }}> 

//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div> 

//               </div> 

//             </div> 

//             <p className="text-xl text-white leading-relaxed max-w-2xl mx-auto font-light mb-4"> 

//               Start creating your events to unlock powerful analytics and insights. 

//             </p> 

//             <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-light"> 

//               📊 Your comprehensive event dashboard with interactive charts will be displayed here once you begin creating events. 

//             </p> 

//           </div> 

 

//           <div className="text-center"> 

//             <div 

//               className="inline-flex items-center space-x-3 px-8 py-4 backdrop-blur-sm border-2 rounded-full transition-all duration-500 hover:shadow-lg cursor-pointer" 

//               style={{ backgroundColor: 'rgba(39, 76, 119, 0.1)', borderColor: '#274c77' }} 

//               onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(39, 76, 119, 0.2)')} 

//               onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(39, 76, 119, 0.1)')} 

//             > 

//               <Sparkles size={20} className="animate-pulse" style={{ color: '#ffffff' }} /> 

//               <span className="font-semibold text-lg text-white">Create Your First Event</span> 

//               <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ffffff' }}></div> 

//             </div> 

//           </div> 

//         </div> 

//       </div> 

//     </div> 

//   ); 

// }; 

 

// // Main Dashboard Component 

// const EventDashboard = ({ events = [] }) => { 

//   const [selectedChart, setSelectedChart] = useState('vertical-bar'); 

 

//   const chartOptions = [ 

//     { value: 'vertical-bar', label: 'Vertical Bar Chart', icon: BarChart3 }, 

//     { value: 'horizontal-bar', label: 'Horizontal Bar Chart', icon: BarChart2 }, 

//     { value: 'line', label: 'Line Chart', icon: LineChart }, 

//     { value: 'area', label: 'Area Chart', icon: TrendingUp }, 

//     { value: 'pie', label: 'Pie Chart', icon: PieChart }, 

//     { value: 'histogram', label: 'Histogram', icon: Activity }, 

//   ]; 

 

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']; 

 

//   const sampleData = [ 

//     { name: 'Event A', value: 400 }, 

//     { name: 'Event B', value: 300 }, 

//     { name: 'Event C', value: 300 }, 

//     { name: 'Event D', value: 200 }, 

//   ]; 

 

//   const renderChart = () => { 

//     if (!events || events.length === 0) return null; 

//     switch (selectedChart) { 

//       case 'vertical-bar': 

//         return ( 

//           <ResponsiveContainer width="100%" height="100%"> 

//             <BarChart data={sampleData}> 

//               <CartesianGrid strokeDasharray="3 3" /> 

//               <XAxis dataKey="name" /> 

//               <YAxis /> 

//               <Tooltip /> 

//               <Legend /> 

//               <Bar dataKey="value" fill="#8884d8" /> 

//             </BarChart> 

//           </ResponsiveContainer> 

//         ); 

//       case 'line': 

//         return ( 

//           <ResponsiveContainer width="100%" height="100%"> 

//             <RechartsLineChart data={sampleData}> 

//               <XAxis dataKey="name" /> 

//               <YAxis /> 

//               <Tooltip /> 

//               <Line type="monotone" dataKey="value" stroke="#8884d8" /> 

//             </RechartsLineChart> 

//           </ResponsiveContainer> 

//         ); 

//       case 'area': 

//         return ( 

//           <ResponsiveContainer width="100%" height="100%"> 

//             <AreaChart data={sampleData}> 

//               <XAxis dataKey="name" /> 

//               <YAxis /> 

//               <Tooltip /> 

//               <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" /> 

//             </AreaChart> 

//           </ResponsiveContainer> 

//         ); 

//       case 'pie': 

//         return ( 

//           <ResponsiveContainer width="100%" height="100%"> 

//             <RechartsPieChart> 

//               <Pie 

//                 data={sampleData} 

//                 cx="50%" 

//                 cy="50%" 

//                 outerRadius={100} 

//                 fill="#8884d8" 

//                 dataKey="value" 

//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 

//               > 

//                 {sampleData.map((entry, index) => ( 

//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> 

//                 ))} 

//               </Pie> 

//             </RechartsPieChart> 

//           </ResponsiveContainer> 

//         ); 

//       default: 

//         return <div>Chart type not supported yet.</div>; 

//     } 

//   }; 

 

//   if (!events || events.length === 0) { 

//     return <NoEventSelected />; 

//   } 

 

//   return ( 

//     <div className="p-8 space-y-8"> 

//       <div> 

//         <h2 className="text-3xl font-bold text-gray-900 mb-1">Event Analytics Dashboard</h2> 

//         <p className="text-gray-500">Comprehensive insights and analytics for your events</p> 

//       </div> 

 

//       <div> 

//         <label className="block text-sm font-medium text-gray-700 mb-2">Select Chart Type</label> 

//         <select 

//           value={selectedChart} 

//           onChange={(e) => setSelectedChart(e.target.value)} 

//           className="block w-full max-w-xs px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none" 

//         > 

//           {chartOptions.map((option) => ( 

//             <option key={option.value} value={option.value}> 

//               {option.label} 

//             </option> 

//           ))} 

//         </select> 

//       </div> 

 

//       <div className="h-96">{renderChart()}</div> 

 

//       {/* Summary Cards */} 

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 

//         <div className="bg-white rounded-lg shadow p-6"> 

//           <div className="flex items-center"> 

//             <Users className="w-8 h-8 text-green-600" /> 

//             <div className="ml-4"> 

//               <p className="text-sm font-medium text-gray-600">Active Events</p> 

//               <p className="text-2xl font-semibold text-gray-900">0</p> 

//             </div> 

//           </div> 

//         </div> 

//         <div className="bg-white rounded-lg shadow p-6"> 

//           <div className="flex items-center"> 

//             <Clock className="w-8 h-8 text-yellow-600" /> 

//             <div className="ml-4"> 

//               <p className="text-sm font-medium text-gray-600">Upcoming</p> 

//               <p className="text-2xl font-semibold text-gray-900">0</p> 

//             </div> 

//           </div> 

//         </div> 

//         <div className="bg-white rounded-lg shadow p-6"> 

//           <div className="flex items-center"> 

//             <Star className="w-8 h-8 text-purple-600" /> 

//             <div className="ml-4"> 

//               <p className="text-sm font-medium text-gray-600">Completed</p> 

//               <p className="text-2xl font-semibold text-gray-900">0</p> 

//             </div> 

//           </div> 

//         </div> 

//       </div> 

//     </div> 

//   ); 

// }; 

 

// export default EventDashboard; 