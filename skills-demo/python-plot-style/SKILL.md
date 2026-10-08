---
name: python-plot-style                                                                    
description: Concise matplotlib plotting conventions for consistent scientific figures (figure size, DPI, typography, axes, grid, colors, legends, and export).                   
---
                                                                                         
Purpose                                                                                    
Provide short, practical matplotlib conventions for producing clean, consistent scientific 
figures in Python. Use these as defaults unless a specific alternative is requested.       
                                                                                            
Core principles                                                                            
- Keep visuals legible at presentation resolution (1920×1080) and at high export           
  resolution (300 DPI).                                                                    
- Do not change the user's default font family unless explicitly requested.                
- Favor clarity: readable ticks/labels, clear grid, visible line widths, and sensible      
  legend placement.                                                                        
                                                                                            
 Figure size and DPI — important distinction                                                
 - On-screen window (canvas) pixel size is determined by: figsize_inches × fig.dpi.         
 - Export image pixel size is determined by: figsize_inches × save_dpi (dpi passed to       
   savefig).                                                                                
 - To create a 1920×1080 on-screen canvas and export at 300 DPI:                            
   fig, ax = plt.subplots()                                                                 
   fig.set_size_inches(1920 / fig.get_dpi(), 1080 / fig.get_dpi())  # on-screen ~1920×1080  
   px                                                                                       
   ... draw ...                                                                             
   fig.savefig('Figure.png', dpi=300, bbox_inches='tight')          # export at 300 DPI     
                                                                                            
 Default rcParams (suggested)                                                               
 - axes.titlesize = 32 (bold)                                                               
 - axes.labelsize = 24 (bold)                                                               
 - xtick.labelsize = 24                                                                     
 - ytick.labelsize = 24                                                                     
 - legend.fontsize = 24                                                                     
 - lines.linewidth = 1.5                                                                    
                                                                                            
 Axes, grid, and box                                                                        
 - Enable grid and box for clarity: ax.grid(True, which='both', color='#e6e6e6'); keep      
   spines visible and thin.                                                                 
 - Use descriptive axis labels with units where appropriate.                                
 - Make major ticks and labels bold for readability.                                        
                                                                                            
 Lines, markers, and colors                                                                 
 - Default line width 1.5; reference lines 2.0.                                             
 - Use black for primary data lines; use clear contrasting colors for references (e.g.,     
   red).                                                                                    
 - For elements with edges, prefer black edge color.                                        
                                                                                            
 Ticks and ticks formatting                                                                 
 - Choose “nice” tick spacings and include endpoint ticks when helpful.                     
 - Rotate long tick labels only when needed.                                                
 - Use tight, readable numeric formatting; avoid overly many tick labels.                   
                                                                                            
 Legends and annotations                                                                    
 - Use legend(loc='best') unless overlap requires manual placement.                         
 - Keep legend font size consistent with axes (≈24).                                        
                                                                                            
 Export                                                                                     
 - Default export resolution: 300 DPI for PNG.                                              
 - Use bbox_inches='tight' to avoid clipped labels.                                         
 - Prefer descriptive filenames.                                                            
                                                                                            
 Minimal example (Python / matplotlib)                                                      
 - Create a 1920×1080 on-screen figure and export at 300 DPI:                               
   import matplotlib.pyplot as plt                                                          
   fig, ax = plt.subplots()                                                                 
   fig.set_size_inches(1920 / fig.get_dpi(), 1080 / fig.get_dpi())                          
   apply rcParams as above, plot, format axes...                                            
   fig.savefig('Figure_Name.png', dpi=300, bbox_inches='tight')
