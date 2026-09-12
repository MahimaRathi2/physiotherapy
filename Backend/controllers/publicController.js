const Service = require("../models/Service");
const Physiotherapist = require("../models/Physiotherapist");
const Testimonial = require("../models/Testimonial");
const FAQ = require("../models/FAQ");
const ClinicInfo = require("../models/ClinicInfo");
const Blog = require("../models/Blog");

const getServices = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;

    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, active: true });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const { search, specialization } = req.query;
    const filter = { active: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } }
      ];
    }

    if (specialization && specialization !== "all") {
      filter.specialization = { $regex: specialization, $options: "i" };
    }

    const doctors = await Physiotherapist.find(filter).sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

const getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};

const getClinicInfo = async (req, res, next) => {
  try {
    let info = await ClinicInfo.findOne({ active: true });
    if (!info) {
      info = {
        clinicName: "Satya Physiotherapy Center",
        tagline: "Move better. Heal deeper. Live stronger.",
        helpline: "+91 7500831828",
        address: "Satya Physiotherapy Center, Main Road, New Delhi",
        email: "contact@satyaphysio.com",
        clinicHours: "Mon–Sat: 8 AM – 8 PM · Sun: 9 AM – 1 PM",
        heroStats: {
          yearsPractice: "15+",
          recoveriesGuided: "12k+",
          recommendationRate: "98%",
          ratingScore: "4.9 / 5",
          totalReviews: "from 900+ patient reviews"
        }
      };
    }
    res.status(200).json({
      success: true,
      data: info
    });
  } catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    let blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    
    // Seed default clinical blogs if database has none
    if (blogs.length === 0) {
      const defaultBlogs = [
        {
          title: "5 Essential Exercises for Decompressing Lower Back Sciatica",
          slug: "5-essential-exercises-lower-back-sciatica",
          category: "Spine & Joint Care",
          author: "Dr. Satya Prakash",
          readTime: "5 min read",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
          excerpt: "Learn how targeted pelvic tilting, cat-cow flexions, and nerve glides reduce herniated disc pressure without surgery.",
          content: "Sciatica pain originating from L4-L5 and L5-S1 lumbar disc herniations can severely impair daily movement. Non-surgical spinal decompression therapy combined with targeted core stabilization exercises helps create negative intra-discal pressure, allowing the bulge to retract away from exiting nerve roots.\n\n1. Pelvic Tilts: Lie flat on your back with knees bent. Gently flatten your spine against the floor by tightening your abdominal muscles. Hold for 5 seconds and repeat 10 times.\n\n2. Cat-Cow Stretch: On all fours, alternate between arching your spine upward and letting your belly sink downward. This gently mobilizes the lumbar facet joints.\n\n3. Nerve Flossing: Sit upright, straighten the affected leg while flexing your ankle upward, then bend your knees while tucking your chin. This releases sciatic nerve entrapment.\n\n4. Cobra Extension: Lie face down and press up through your palms, extending the lower back to promote anterior disc movement.\n\n5. Bird-Dog Stabilization: Maintain a neutral spine while extending alternate arm and leg to strengthen deep multifidus muscles.",
          featured: true,
          published: true
        },
        {
          title: "Class IV High-Intensity Laser Therapy vs SWD: Which is Right for Pain?",
          slug: "class-iv-laser-vs-swd-pain-relief",
          category: "Advanced Pain Tech",
          author: "Dr. Satya Prakash & Team",
          readTime: "6 min read",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
          excerpt: "Understanding deep tissue photobiomodulation versus shortwave diathermy for chronic inflammation, bursitis, and deep joint stiffness.",
          content: "Modern physical therapy modalities have revolutionized non-surgical pain management. Class IV High-Intensity Laser Therapy operates at 905nm and 810nm wavelengths to deliver deep photonic energy to mitochondria in damaged tissue, accelerating ATP synthesis and cellular repair.\n\nShortwave Diathermy (SWD), on the other hand, utilizes high-frequency electromagnetic energy to produce deep volumetric heating in muscular layers. While SWD excels at relieving muscle spasms and chronic joint stiffness, Class IV Laser is superior for nerve pain, acute tendonitis, and localized bursitis where deep cellular healing without thermal overload is required.",
          featured: true,
          published: true
        },
        {
          title: "Post-ACL Reconstruction Milestone Timeline & Safe Return-to-Play",
          slug: "post-acl-reconstruction-milestone-timeline",
          category: "Sports Rehab",
          author: "Senior Sports Physiotherapist",
          readTime: "7 min read",
          image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
          excerpt: "A phase-by-phase guide from initial graft protection to biomechanical agility drills and functional return to competitive sports.",
          content: "Recovering from Anterior Cruciate Ligament (ACL) reconstruction requires a structured, phase-based rehabilitation protocol. Rushing the process increases the risk of graft failure.\n\nPhase 1 (Weeks 0-4): Focus on full knee extension, patellar mobility, quad activation (straight leg raises), and reducing post-op swelling.\n\nPhase 2 (Weeks 4-12): Progressive weight-bearing, single-leg stance balance training, closed kinetic chain exercises (squats, step-ups), and stationary cycling.\n\nPhase 3 (Months 3-6): Dynamic agility, deceleration drills, plyometrics, and biomechanical movement analysis.\n\nPhase 4 (Months 6-9): Sport-specific drills and limb symmetry index (LSI) testing over 90% before full clearance.",
          featured: false,
          published: true
        }
      ];
      blogs = await Blog.insertMany(defaultBlogs);
    }

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog article not found" });
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  getDoctors,
  getTestimonials,
  getFAQs,
  getClinicInfo,
  getBlogs,
  getBlogBySlug
};
