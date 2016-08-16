import React = require('react');

var template = function (view: any) {
    return (<div>
    <div id={"wrapper"}>
        <nav className={"navbar navbar-default navbar-cls-top "} role={"navigation"} style={{marginBottom: 0}}>
            <div className={"navbar-header"}>
                <button type={"button"} className={"navbar-toggle"} data-toggle={"collapse"} data-target={".sidebar-collapse"}>
                    <span className={"sr-only"}>Toggle navigation</span>
                    <span className={"icon-bar"}></span>
                    <span className={"icon-bar"}></span>
                    <span className={"icon-bar"}></span>
                </button>
                <a className={"navbar-brand"} href={"index.html"}>COMPANY NAME</a>
            </div>

            <div className={"header-right"}>
              <a href={"message-task.html"} className={"btn btn-info"} title={"New Message"}><b>30 </b><i className={"fa fa-envelope-o fa-2x"}></i></a>
              <a href={"message-task.html"} className={"btn btn-primary"} title={"New Task"}><b>40 </b><i className={"fa fa-bars fa-2x"}></i></a>
              <a href={"javascript:(function () { parent.postMessage('bookmarklet:close', '*'); })();"} className={"btn btn-danger"} title={"Logout"}><i className={"fa fa-exclamation-circle fa-2x"}></i></a>
            </div>
        </nav>
        {/* /. NAV TOP  */}
        <nav className={"navbar-default navbar-side"} role={"navigation"}>
            <div className={"sidebar-collapse"}>
                <ul className={"nav"} id={"main-menu"}>
                    <li>
                        <div className={"user-img-div"}>
                            <img src={"assets/img/user.png"} className={"img-thumbnail"} />

                            <div className={"inner-text"}>
                                Jhon Deo Alex
                            <br />
                                <small>Last Login : 2 Weeks Ago </small>
                            </div>
                        </div>

                    </li>


                    <li>
                        <a className={"jira-deploy-email"}
                         href={"#deploy-email"}
                         onClick={() => this.runCommand('DeployEmailNavigateCommand')}
                         >
                            <i className={"fa fa-dashboard "}></i>
                            Deploy e-mail
                        </a>
                    </li>
                    <li>
                        <a className={"jira-jira-report"}
                         href={"#jira-report"}
                         onClick={() => this.runCommand('JiraReportNavigateCommand')}
                         >
                            <i className={"fa fa-dashboard "}></i>
                            JIRA Report
                        </a>
                    </li>
                    <li>
                        <a className={"feeding-feeding"}
                         href={"#feeding"}
                         onClick={() => this.runCommand('FeedingPageNavigateCommand')}
                         ><i className={"fa fa-dashboard "}></i>Feeding</a>
                    </li>
                    <li>
                        <a href={"#"}><i className={"fa fa-desktop "}></i>UI Elements <span className={"fa arrow"}></span></a>
                         <ul className={"nav nav-second-level"}>
                            <li>
                                <a href={"panel-tabs.html"}><i className={"fa fa-toggle-on"}></i>Tabs & Panels</a>
                            </li>
                            <li>
                                <a href={"notification.html"}><i className={"fa fa-bell "}></i>Notifications</a>
                            </li>
                             <li>
                                <a href={"progress.html"}><i className={"fa fa-circle-o "}></i>Progressbars</a>
                            </li>
                             <li>
                                <a href={"buttons.html"}><i className={"fa fa-code "}></i>Buttons</a>
                            </li>
                             <li>
                                <a href={"icons.html"}><i className={"fa fa-bug "}></i>Icons</a>
                            </li>
                             <li>
                                <a href={"wizard.html"}><i className={"fa fa-bug "}></i>Wizard</a>
                            </li>
                             <li>
                                <a href={"typography.html"}><i className={"fa fa-edit "}></i>Typography</a>
                            </li>
                             <li>
                                <a href={"grid.html"}><i className={"fa fa-eyedropper "}></i>Grid</a>
                            </li>
                            
                           
                        </ul>
                    </li>
                     <li>
                        <a href={"#"}><i className={"fa fa-yelp "}></i>Extra Pages <span className={"fa arrow"}></span></a>
                         <ul className={"nav nav-second-level"}>
                            <li>
                                <a href={"invoice.html"}><i className={"fa fa-coffee"}></i>Invoice</a>
                            </li>
                            <li>
                                <a href={"pricing.html"}><i className={"fa fa-flash "}></i>Pricing</a>
                            </li>
                             <li>
                                <a href={"component.html"}><i className={"fa fa-key "}></i>Components</a>
                            </li>
                             <li>
                                <a href={"social.html"}><i className={"fa fa-send "}></i>Social</a>
                            </li>
                            
                             <li>
                                <a href={"message-task.html"}><i className={"fa fa-recycle "}></i>Messages & Tasks</a>
                            </li>
                            
                           
                        </ul>
                    </li>
                    <li>
                        <a className={"active-menu"} href={"table.html"}><i className={"fa fa-flash "}></i>Data Tables </a>
                        
                    </li>
                    <li>
                        <a href={"#"}><i className={"fa fa-bicycle "}></i>Forms <span className={"fa arrow"}></span></a>
                         <ul className={"nav nav-second-level"}>
                           
                             <li>
                                <a href={"form.html"}><i className={"fa fa-desktop "}></i>Basic </a>
                            </li>
                             <li>
                                <a href={"form-advance.html"}><i className={"fa fa-code "}></i>Advance</a>
                            </li>
                             
                           
                        </ul>
                    </li>
                     <li>
                        <a href={"gallery.html"}><i className={"fa fa-anchor "}></i>Gallery</a>
                    </li>
                     <li>
                        <a href={"error.html"}><i className={"fa fa-bug "}></i>Error Page</a>
                    </li>
                    <li>
                        <a href={"login.html"}><i className={"fa fa-sign-in "}></i>Login Page</a>
                    </li>
                    <li>
                        <a href={"#"}><i className={"fa fa-sitemap "}></i>Multilevel Link <span className={"fa arrow"}></span></a>
                         <ul className={"nav nav-second-level"}>
                            <li>
                                <a href={"#"}><i className={"fa fa-bicycle "}></i>Second Level Link</a>
                            </li>
                             <li>
                                <a href={"#"}><i className={"fa fa-flask "}></i>Second Level Link</a>
                            </li>
                            <li>
                                <a href={"#"}>Second Level Link<span className={"fa arrow"}></span></a>
                                <ul className={"nav nav-third-level"}>
                                    <li>
                                        <a href={"#"}><i className={"fa fa-plus "}></i>Third Level Link</a>
                                    </li>
                                    <li>
                                        <a href={"#"}><i className={"fa fa-comments-o "}></i>Third Level Link</a>
                                    </li>

                                </ul>

                            </li>
                        </ul>
                    </li>
                   
                    <li>
                        <a href={"blank.html"}><i className={"fa fa-square-o "}></i>Blank Page</a>
                    </li>
                </ul>
            </div>

        </nav>
        {/* /. NAV SIDE  */}
        <div id={"page-wrapper"}>
            {/* render view */}
            {view}
        </div>
        {/* /. PAGE WRAPPER  */}
    </div>
    {/* /. WRAPPER  */}
    <div id={"footer-sec"}>
        &copy; 2014 YourCompany | Design By : <a href={"http://www.binarytheme.com/"} target={"_blank"}>BinaryTheme.com</a>
    </div>
    {/* /. FOOTER  */}
    </div>);
};

export = template;