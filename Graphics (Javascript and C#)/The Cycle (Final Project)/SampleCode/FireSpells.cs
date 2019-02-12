using UnityEngine;
using System.Collections;

public class FireSpells : MonoBehaviour
{

    //Public Vars
    public GameObject attackSpell;
    public GameObject utilitySpell;
    public GameObject defenseSpell;
    public GameObject primarySpell;
    public float primaryFireRate;

    //Private Vars
    private Vector3 mouseWorldPosition;
    private Vector3 direction;
    private Vector3 offset;
    private Quaternion targetRotation;
    private SpellStats spellStats;
    private RFX4_EffectEvent effectEvent;
    private GameObject clone = null;
    private bool spellActive = false;
    private bool isCasting = false;
    private Animator animator;
    private TopViewUserController userController;
    private float nextFire;
    private float castingTime;
    private Transform ringTransform;


    void Start()
    {
        nextFire = primaryFireRate;
        animator = GetComponent<Animator>();
        userController = GetComponent<TopViewUserController>();
        effectEvent = GetComponent<RFX4_EffectEvent>();

        if (primarySpell.CompareTag("Ether"))
        {
            GameObject etherRing = GameObject.Find("EtherRing");
            ringTransform = etherRing.transform;
            offset = etherRing.transform.GetChild(0).position - ringTransform.position;
        }
        
    }

    void Update()
    {

        // If there is no current spell cast set spellActive to null
        if (clone == null)
        {
            spellActive = false;
        }

        if (!SpellBehavior.isAnimating)
        {
            userController.CanMove(true);
        }

        if (Time.time > castingTime)
        {
            isCasting = false;
        }

        if (Input.GetKeyUp(KeyCode.Mouse1))
        {
            if (!spellActive)
            {
                userController.CanMove(false);

                MouseRayCast();

                transform.rotation = targetRotation;
            }
            


            FireSpell(1);
        }

        if (Input.GetKey(KeyCode.Mouse0) && Time.time > nextFire)
        {
            if (!isCasting)
            {
                nextFire = Time.time + primaryFireRate;
         
                MouseRayCast();

                FirePrimary();
            }
            
        }
    }//End Update


    void MouseRayCast()
    {
        //Grab the current mouse position on the screen
        // mouseWorldPosition = camera.ScreenToWorldPoint(new Vector3(Input.mousePosition.x, Input.mousePosition.y, transform.position.z));

        Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
        RaycastHit hitInfo; //create a variable to store information about the object hit (if any)

        //Check to see if the ray hits any objects in the scene
        //Also pass in hitInfo, so that Raycast can store the information about the hit there
        //The out keyword is a parameter modifier used to tell C# that this object should be passed by reference, instead of by value
        //basically it makes it so we can properly access hitInfo.
        //It's important to note that the objects we're hoping to hit with our ray must have a collider component attached to them
        if (Physics.Raycast(ray, out hitInfo))
        {
            //Move this object to the postion we hit.
            mouseWorldPosition = new Vector3(hitInfo.point.x, hitInfo.point.y, hitInfo.point.z - 0.5f);
            //mouseWorldPosition = new Vector3(hitInfo.point.x, hitInfo.point.y, hitInfo.point.z);

        }

        //Finds the rotation towards the mouse
        targetRotation = Quaternion.LookRotation(mouseWorldPosition - transform.position);
        targetRotation.x = 0f;
        targetRotation.z = 0f;
    }

    // Fires primary weapon
    void FirePrimary()
    {
        Vector3 spawnTarget = mouseWorldPosition - transform.position;
        Vector3 orbTarget;
        GameObject clone;
        SpellStats spellStats = primarySpell.GetComponent<SpellStats>();
        float spawnAngle;

        // Used to fire from nether ring surrounding player
        if (primarySpell.CompareTag("Nether"))
        {
            // Finds the spawn point on the nether ring
            spawnTarget = transform.position + (spawnTarget.normalized * spellStats.spellRadius);
            spawnTarget.y += 1.2f;
            spellStats.Spawn(spawnTarget, targetRotation);

        }
        // Fires spells from orb surrounding player
        else if (primarySpell.CompareTag("Ether"))
        {
            spawnAngle = Mathf.Atan2(spawnTarget.z, spawnTarget.x);
            orbTarget = ringTransform.position;

            // Sets the spawn coordinates to the sphere within the quadrant the spawn vector is within
            if (spawnAngle >= 0 && spawnAngle < Mathf.PI / 4 && spawnTarget.x >= 0)
            {
                orbTarget.x += offset.x;
                orbTarget.z += offset.z;
            }
            else if (spawnAngle >= Mathf.PI / 4 && spawnAngle < Mathf.PI / 2 && spawnTarget.x >= 0)
            {
                // Switches coordinates because of different angle
                orbTarget.x += offset.z;
                orbTarget.z += offset.x;
            }
            else if(spawnAngle >= Mathf.PI / 2 && spawnAngle < 3 * Mathf.PI / 4 && spawnTarget.x < 0)
            {
                orbTarget.x -= offset.z;
                orbTarget.z += offset.x;
            }
            else if(spawnAngle >= 3 * Mathf.PI / 4 && spawnAngle < Mathf.PI  && spawnTarget.x < 0)
            {
                orbTarget.x -= offset.x;
                orbTarget.z += offset.z;
            }          
            else if(spawnAngle >= -Mathf.PI && spawnAngle < -3 * Mathf.PI / 4)
            {
                orbTarget.x -= offset.x;
                orbTarget.z -= offset.z;
            }
            else if(spawnAngle >= -3 * Mathf.PI / 4 && spawnAngle < -Mathf.PI / 2 && spawnTarget.x < 0)
            {
                orbTarget.x -= offset.z;
                orbTarget.z -= offset.x;
            }
            else if(spawnAngle >= -Mathf.PI / 2 && spawnAngle < -Mathf.PI / 4 && spawnTarget.x >= 0)
            {
                orbTarget.x += offset.z;
                orbTarget.z -= offset.x;
            }
            else if(spawnAngle >= -Mathf.PI / 4 && spawnAngle < 0 && spawnTarget.x > 0)
            {
                orbTarget.x += offset.x;
                orbTarget.z -= offset.z;
            }

           clone = spellStats.Spawn(orbTarget, targetRotation);
           clone.transform.parent = ringTransform;

        }
    }

    // Creats spell object depending on selected spell
    void FireSpell(int selectSpell)
    {
        if (!spellActive)
        {
            switch (selectSpell)
            {
                case 1:
                    spellStats = attackSpell.GetComponent<SpellStats>();
                    if (spellStats.characterSpawn == true)
                    {
                        clone = spellStats.Spawn(transform.position, targetRotation);
                    }
                    else
                    {
                        clone = spellStats.Spawn(mouseWorldPosition);
                    }

                    effectEvent.Effect = clone;
                    UpdateAnimator(spellStats.spellAnimationSelector);

                    break;
                default:
                    break;
            }


            spellActive = true;
            isCasting = true;
            castingTime = spellStats.spellAnimation.averageDuration + Time.time;
            Destroy(clone, spellStats.lifeTime);
        }   
        
    }

    // Update the animators parameters
    private void UpdateAnimator(int selectSpell)
    {
        animator.SetInteger("Spell", selectSpell);
    }
}
     
