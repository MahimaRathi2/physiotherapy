import React, { useState, useEffect } from 'react';
import { Clock, User, ArrowUpRight, X, BookOpen, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { api } from '../services/api';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fallbackBlogs = [
    {
      _id: 'b1',
      title: "5 Essential Exercises for Decompressing Lower Back Sciatica",
      slug: "5-essential-exercises-lower-back-sciatica",
      category: "Spine & Joint Care",
      author: "Dr. Satya Prakash",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      excerpt: "Learn how targeted pelvic tilting, cat-cow flexions, and nerve glides reduce herniated disc pressure without surgery.",
      content: "Sciatica pain originating from L4-L5 and L5-S1 lumbar disc herniations can severely impair daily movement. Non-surgical spinal decompression therapy combined with targeted core stabilization exercises helps create negative intra-discal pressure, allowing the bulge to retract away from exiting nerve roots.\n\n1. Pelvic Tilts: Lie flat on your back with knees bent. Gently flatten your spine against the floor by tightening your abdominal muscles. Hold for 5 seconds and repeat 10 times.\n\n2. Cat-Cow Stretch: On all fours, alternate between arching your spine upward and letting your belly sink downward. This gently mobilizes the lumbar facet joints.\n\n3. Nerve Flossing: Sit upright, straighten the affected leg while flexing your ankle upward, then bend your knees while tucking your chin. This releases sciatic nerve entrapment.\n\n4. Cobra Extension: Lie face down and press up through your palms, extending the lower back to promote anterior disc movement.\n\n5. Bird-Dog Stabilization: Maintain a neutral spine while extending alternate arm and leg to strengthen deep multifidus muscles."
    },
    {
      _id: 'b2',
      title: "Class IV High-Intensity Laser Therapy vs SWD: Which is Right for Pain?",
      slug: "class-iv-laser-vs-swd-pain-relief",
      category: "Advanced Pain Tech",
      author: "Dr. Satya Prakash & Team",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      excerpt: "Understanding deep tissue photobiomodulation versus shortwave diathermy for chronic inflammation, bursitis, and deep joint stiffness.",
      content: "Modern physical therapy modalities have revolutionized non-surgical pain management. Class IV High-Intensity Laser Therapy operates at 905nm and 810nm wavelengths to deliver deep photonic energy to mitochondria in damaged tissue, accelerating ATP synthesis and cellular repair.\n\nShortwave Diathermy (SWD), on the other hand, utilizes high-frequency electromagnetic energy to produce deep volumetric heating in muscular layers. While SWD excels at relieving muscle spasms and chronic joint stiffness, Class IV Laser is superior for nerve pain, acute tendonitis, and localized bursitis where deep cellular healing without thermal overload is required."
    },
    {
      _id: 'b3',
      title: "Post-ACL Reconstruction Milestone Timeline & Safe Return-to-Play",
      slug: "post-acl-reconstruction-milestone-timeline",
      category: "Sports Rehab",
      author: "Senior Sports Physiotherapist",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      excerpt: "A phase-by-phase guide from initial graft protection to biomechanical agility drills and functional return to competitive sports.",
      content: "Recovering from Anterior Cruciate Ligament (ACL) reconstruction requires a structured, phase-based rehabilitation protocol. Rushing the process increases the risk of graft failure.\n\nPhase 1 (Weeks 0-4): Focus on full knee extension, patellar mobility, quad activation (straight leg raises), and reducing post-op swelling.\n\nPhase 2 (Weeks 4-12): Progressive weight-bearing, single-leg stance balance training, closed kinetic chain exercises (squats, step-ups), and stationary cycling.\n\nPhase 3 (Months 3-6): Dynamic agility, deceleration drills, plyometrics, and biomechanical movement analysis.\n\nPhase 4 (Months 6-9): Sport-specific drills and limb symmetry index (LSI) testing over 90% before full clearance."
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.getBlogs();
        if (res.data && res.data.length > 0) {
          setBlogs(res.data);
        } else {
          setBlogs(fallbackBlogs);
        }
      } catch (err) {
        console.error("Failed to load blogs:", err);
        setBlogs(fallbackBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="blog-section section-padding" id="blog">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-light">
          <span className="section-tag-teal">CLINICAL KNOWLEDGE & INSIGHTS</span>
          <h2 className="section-title-dark">
            Physiotherapy & <span className="serif-italic-teal">Recovery Blog</span>
          </h2>
          <p className="section-subtitle-dark">
            Expert articles, non-surgical pain management guides, and rehabilitation insights authored by our senior physical therapy team.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div className="light-card blog-card" key={blog._id || blog.slug}>
              
              {/* Blog Image Wrapper */}
              <div 
                className="blog-img-wrapper"
                onClick={() => setSelectedBlog(blog)}
                style={{ cursor: 'pointer' }}
              >
                <img src={blog.image} alt={blog.title} className="blog-img" />
                <span className="blog-category-badge">{blog.category}</span>
              </div>

              {/* Blog Card Content */}
              <div className="blog-card-body">
                <div className="blog-meta-row">
                  <span className="blog-meta-item">
                    <User size={14} />
                    <span>{blog.author}</span>
                  </span>
                  <span className="blog-meta-item">
                    <Clock size={14} />
                    <span>{blog.readTime}</span>
                  </span>
                </div>

                <h3 className="blog-card-title" onClick={() => setSelectedBlog(blog)} style={{ cursor: 'pointer' }}>
                  {blog.title}
                </h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>

                <button 
                  type="button"
                  className="card-link-teal blog-read-btn"
                  onClick={() => setSelectedBlog(blog)}
                >
                  <span>Read Full Article</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Full Article Detail Modal */}
      {selectedBlog && (
        <div className="service-modal-overlay" onClick={() => setSelectedBlog(null)}>
          <div className="service-modal-container blog-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="service-modal-close" onClick={() => setSelectedBlog(null)} aria-label="Close article">
              <X size={20} />
            </button>

            <div className="blog-modal-banner">
              <img src={selectedBlog.image} alt={selectedBlog.title} />
              <span className="service-modal-tag">{selectedBlog.category}</span>
            </div>

            <div className="service-modal-content">
              <div className="service-modal-header">
                <h2>{selectedBlog.title}</h2>
                <div className="service-modal-meta">
                  <span className="meta-badge"><User size={14} /> {selectedBlog.author}</span>
                  <span className="meta-badge"><Clock size={14} /> {selectedBlog.readTime}</span>
                  <span className="meta-badge"><ShieldCheck size={14} /> Clinical Review Verified</span>
                </div>
              </div>

              <div className="service-modal-body blog-modal-body">
                <div className="blog-full-content">
                  {selectedBlog.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="service-modal-footer">
                <a href="#cta" className="btn btn-teal service-modal-book-btn" onClick={() => setSelectedBlog(null)}>
                  <span>Book a Consultation with Dr. Satya</span>
                  <ArrowUpRight size={18} />
                </a>
                <button className="btn btn-outline" onClick={() => setSelectedBlog(null)}>
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
